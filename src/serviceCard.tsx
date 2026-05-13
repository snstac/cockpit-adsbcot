/*
 * Copyright Sensors & Signals LLC https://www.snstac.com/
 */

import React, { useEffect, useState } from 'react';
import { Alert } from '@patternfly/react-core/dist/esm/components/Alert/index.js';
import { Card, CardBody, CardTitle } from '@patternfly/react-core/dist/esm/components/Card/index.js';
import { capitalize } from '@patternfly/react-core';
import cockpit from 'cockpit';

const _ = cockpit.gettext;

function unitPath(serviceName: string): string {
    return (
        '/org/freedesktop/systemd1/unit/' +
        serviceName.replace(/-/g, '_') +
        '_2eservice'
    );
}

async function getUnitProperty(
    serviceName: string,
    iface: string,
    prop: string
): Promise<unknown> {
    const result = await cockpit.dbus('org.freedesktop.systemd1', { superuser: 'try' }).call(
        unitPath(serviceName),
        'org.freedesktop.DBus.Properties',
        'Get',
        [iface, prop]
    );
    return result[0]?.v;
}

export type ToastMessage = { variant: 'success' | 'danger' | 'warning'; title: string };

type ServiceManagementCardProps = {
    serviceName: string;
    onToast: (t: ToastMessage) => void;
};

export function ServiceManagementCard({ serviceName, onToast }: ServiceManagementCardProps) {
    const [activeState, setActiveState] = useState<string | null>(null);
    const [subState, setSubState] = useState<string | null>(null);
    const [loadState, setLoadState] = useState<string | null>(null);
    const [unitFileState, setUnitFileState] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        async function fetchAll() {
            try {
                const [active, sub, load, uf] = await Promise.all([
                    getUnitProperty(serviceName, 'org.freedesktop.systemd1.Unit', 'ActiveState'),
                    getUnitProperty(serviceName, 'org.freedesktop.systemd1.Unit', 'SubState'),
                    getUnitProperty(serviceName, 'org.freedesktop.systemd1.Unit', 'LoadState'),
                    getUnitProperty(serviceName, 'org.freedesktop.systemd1.Unit', 'UnitFileState'),
                ]);
                if (!cancelled) {
                    setActiveState(String(active ?? 'unknown'));
                    setSubState(String(sub ?? ''));
                    setLoadState(String(load ?? ''));
                    setUnitFileState(String(uf ?? ''));
                    setError(null);
                }
            } catch {
                if (!cancelled) {
                    setError(_('Failed to get service status.'));
                    setActiveState(null);
                }
            }
        }
        fetchAll();
        const interval = setInterval(fetchAll, 4000);
        return () => {
            cancelled = true;
            clearInterval(interval);
        };
    }, [serviceName]);

    async function runCtl(action: string, label: string) {
        try {
            await cockpit.spawn(['systemctl', action, serviceName], { superuser: 'try' });
            onToast({ variant: 'success', title: _('Completed: {0}').replace('{0}', label) });
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            onToast({
                variant: 'danger',
                title: _('Failed: {0}').replace('{0}', label) + (msg ? ` (${msg})` : ''),
            });
        }
    }

    function stateColor(): string {
        if (!activeState) return 'gray';
        if (activeState === 'active') return 'green';
        if (activeState === 'inactive') return 'red';
        if (activeState === 'failed') return 'darkred';
        return 'gray';
    }

    return (
        <Card data-testid="adsbcot-service-card">
            <CardTitle>
                <ServiceDescription serviceName={serviceName} />
            </CardTitle>
            <CardBody>
                {error && <Alert variant="danger" title={error} />}

                {!error && (
                    <CardTitle>
                        <span
                            style={{
                                display: 'inline-block',
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                background: stateColor(),
                                marginRight: 8,
                                verticalAlign: 'middle',
                            }}
                        />
                        <strong>{capitalize(activeState ?? _('unknown'))}</strong>
                        {subState ? ` (${capitalize(subState)})` : ''}
                        <span style={{ marginLeft: '1rem', color: '#666' }}>
                            {_('Load')}: {loadState ?? '—'}
                        </span>
                        <span style={{ marginLeft: '1rem', color: '#666' }}>
                            {_('Enabled')}: {unitFileState ?? '—'}
                        </span>
                    </CardTitle>
                )}

                <CardTitle>
                    <div style={{ display: 'flex', gap: '1em', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                        <button
                            type="button"
                            className="pf-c-button pf-m-primary"
                            onClick={() => runCtl('start', _('Start'))}
                        >
                            {_('Start')}
                        </button>
                        <button
                            type="button"
                            className="pf-c-button pf-m-secondary"
                            onClick={() => runCtl('stop', _('Stop'))}
                        >
                            {_('Stop')}
                        </button>
                        <button
                            type="button"
                            className="pf-m-secondary pf-c-button"
                            onClick={() => runCtl('restart', _('Restart'))}
                        >
                            {_('Restart')}
                        </button>
                        <button
                            type="button"
                            className="pf-c-button pf-m-secondary"
                            onClick={() => runCtl('enable', _('Enable'))}
                        >
                            {_('Enable')}
                        </button>
                        <button
                            type="button"
                            className="pf-c-button pf-m-secondary"
                            onClick={() => runCtl('disable', _('Disable'))}
                        >
                            {_('Disable')}
                        </button>
                    </div>
                </CardTitle>

                <CardTitle style={{ marginTop: '1rem' }}>
                    <ServiceDocsLink serviceName={serviceName} />
                </CardTitle>
            </CardBody>
        </Card>
    );
}

function ServiceDescription({ serviceName }: { serviceName: string }) {
    const [description, setDescription] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const v = await getUnitProperty(
                    serviceName,
                    'org.freedesktop.systemd1.Unit',
                    'Description'
                );
                if (!cancelled) setDescription(typeof v === 'string' ? v : null);
            } catch {
                if (!cancelled) setDescription(null);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [serviceName]);

    return <span>{description || _('No description available for this service.')}</span>;
}

function ServiceDocsLink({ serviceName }: { serviceName: string }) {
    const [docsUrl, setDocsUrl] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                let doc = await getUnitProperty(
                    serviceName,
                    'org.freedesktop.systemd1.Unit',
                    'Documentation'
                );
                if (Array.isArray(doc) && doc.length) doc = doc[0];
                if (!cancelled) setDocsUrl(typeof doc === 'string' && doc ? doc : null);
            } catch {
                if (!cancelled) setDocsUrl(null);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [serviceName]);

    const url =
        docsUrl ||
        `https://www.google.com/search?q=${encodeURIComponent(serviceName + ' documentation')}`;
    return (
        <a href={url} target="_blank" rel="noopener noreferrer">
            {_('Online Documentation')}
        </a>
    );
}
