import { EnvVarDefinition } from '@snstac/cockpit-shared';

export const CONF_PARAMS: Record<string, EnvVarDefinition> = {

    LOG_LEVEL: {
        type: 'enum',
        description: 'Logging level',
        defaultValue: 'INFO',
        options: ['DEBUG', 'INFO', 'WARN', 'ERROR'],
        validation: /^(DEBUG|INFO|WARN|ERROR)$/i,
        required: false
    },

    DEBUG: {
        type: 'boolean',
        description: 'PyTAK debug logging (any non-false value enables verbose behavior)',
        defaultValue: 'false',
        validation: /^(true|false|yes|no|1|0)$/i,
        required: false
    },

    TAK_PROTO: {
        type: 'number',
        description: 'PyTAK TAK protocol variant (integer, see PyTAK documentation)',
        defaultValue: '',
        validation: /^\d+$/,
        required: false
    },

    PREF_PACKAGE: {
        type: 'path',
        description: 'Path to TAK Data Package (.zip) with connection settings or certificates',
        defaultValue: '',
        validation: /^(?:|[/][\w./-]*)$/,
        requiresQuoting: false,
        required: false
    },

    COT_URL: {
        type: 'url',
        description: 'URL of the CoT destination, typically Mesh SA or TAK Server',
        defaultValue: 'udp+wo://239.2.3.1:6969',
        validation: /^(udp\+wo|http|https|udp|tcp|tls|file|log|tcp\+wo|udp\+broadcast):\/\/[^\s]+$/,
        requiresQuoting: false,
        required: true
    },

    FEED_URL: {
        type: 'url',
        description: 'ADS-B data source URL. Can be a local file (file://), a web URL (http:// or https://), a dump1090 BaseStation (SBS-1, "raw") host and port (tcp+raw://xxx:30003), a dump1090 Beast binary post and port (tcp+beast://xxx:30005) (unix://). For dump1090-fa, use file:///run/dump1090-fa/aircraft.json',
        defaultValue: 'file:///run/dump1090-fa/aircraft.json',
        validation: /^(?:https?|file|unix|tcp|tcp\+raw|tcp\+beast):\/\/[^\s]+$/i,
        requiresQuoting: false,
        required: false
    },

    POLL_INTERVAL: {
        type: 'number',
        description: 'If the FEED_URL is of type HTTP, the period, in seconds, to poll this URL.',
        defaultValue: '3',
        validation: /^\d+$/,
        range: [1, 3600], // 1 second to 1 hour,
        required: false
    },

    KNOWN_CRAFT: {
        type: 'path',
        description: 'CSV-style hints file for overriding callsign, icon, COT Type, etc',
        defaultValue: '',
        validation: /^(?:|[/][\w./-]*)$/,
        requiresQuoting: false,
        required: false
    },

    INCLUDE_ALL_CRAFT: {
        type: 'boolean',
        description: 'If KNOWN_CRAFT is set, include all craft in the CoT, even those not in the KNOWN_CRAFT file.',
        defaultValue: 'true',
        validation: /^(true|false|yes|no|1|0)$/i,
        required: false
    },

    INCLUDE_TISB: {
        type: 'boolean',
        description: 'Include TIS-B targets in the CoT output (if available from the data source)',
        defaultValue: 'false',
        validation: /^(true|false|yes|no|1|0)$/i,
        required: false
    },

    TISB_ONLY: {
        type: 'boolean',
        description: 'Include ONLY TIS-B targets in the CoT output (if available from the data source)',
        defaultValue: 'false',
        validation: /^(true|false|yes|no|1|0)$/i,
        required: false
    },

    ALT_UPPER: {
        type: 'number',
        description: 'Upper Altitude Limit, geometric (GNSS / INS) altitude in feet referenced to the WGS84 ellipsoid..',
        defaultValue: '',
        validation: /^\d+$/,
        required: false
    },

    ALT_LOWER: {
        type: 'number',
        description: 'Lower Altitude Limit, geometric (GNSS / INS) altitude in feet referenced to the WGS84 ellipsoid..',
        defaultValue: '',
        validation: /^\d+$/,
        required: false
    },

    EXTRA_ARGS: {
        type: 'string',
        description: 'Additional command line arguments (NOT IMPLEMENTED YET)',
        defaultValue: '',
        requiresQuoting: false,
        required: false
    },

    // PyTAK TLS Configuration
    PYTAK_TLS_CLIENT_CERT: {
        type: 'path',
        description: 'Path to the TLS client certificate file, if required',
        defaultValue: '',
        validation: /^(?:|[/][\w./-]*)$/,
        requiresQuoting: false,
        required: false
    },

    PYTAK_TLS_CLIENT_KEY: {
        type: 'path',
        description: 'Path to the TLS client key file, if required',
        defaultValue: '',
        validation: /^(?:|[/][\w./-]*)$/,
        requiresQuoting: false,
        required: false
    },

    PYTAK_TLS_CLIENT_PASSWORD: {
        type: 'string',
        description: 'Password for the TLS client certificate, if required',
        defaultValue: '',
        requiresQuoting: false,
        required: false
    },

    PYTAK_TLS_CLIENT_CAFILE: {
        type: 'path',
        description: 'Path to the CA file for TLS connections, if required',
        defaultValue: '',
        validation: /^(?:|[/][\w./-]*)$/,
        requiresQuoting: false,
        required: false

    },

    PYTAK_TLS_CLIENT_CIPHERS: {
        type: 'string',
        description: 'Ciphers to use for TLS connections, if required',
        defaultValue: '',
        requiresQuoting: false,
        required: false
    },

    PYTAK_TLS_DONT_CHECK_HOSTNAME: {
        type: 'boolean',
        description: 'Disable hostname verification for TLS connections',
        defaultValue: 'false',
        validation: /^(true|false|yes|no|1|0)$/i,
        required: false
    },
    PYTAK_TLS_DONT_VERIFY: {
        type: 'boolean',
        description: 'Disable TLS certificate verification',
        defaultValue: 'false',
        validation: /^(true|false|yes|no|1|0)$/i,
        required: false
    },
    PYTAK_TLS_SERVER_EXPECTED_HOSTNAME: {
        type: 'string',
        description: 'Expected hostname for the TLS server, used for verification',
        defaultValue: '',
        requiresQuoting: false,
        required: false
    },
    PYTAK_TLS_CERT_ENROLLMENT_USERNAME: {
        type: 'string',
        description: 'Username for TLS certificate enrollment',
        defaultValue: '',
        requiresQuoting: false,
        required: false
    },
    PYTAK_TLS_CERT_ENROLLMENT_PASSWORD: {
        type: 'string',
        description: 'Password for TLS certificate enrollment',
        defaultValue: '',
        requiresQuoting: false,
        required: false
    },
    PYTAK_TLS_CERT_ENROLLMENT_PASSPHRASE: {
        type: 'string',
        description: 'Passphrase for the TLS certificate enrollment, if required',
        defaultValue: '',
        requiresQuoting: false,
        required: false
    },

    COT_ACCESS: {
        type: 'enum',
        description: 'CoT Access level for the messages',
        defaultValue: 'public',
        options: ['public', 'restricted', 'private'],
        validation: /^(public|restricted|private)$/i,
        required: false
    },

    // CoT Event Type and Icon Configuration
    COT_STALE: {
        type: 'number',
        description: 'CoT Stale period ("timeout"), in seconds',
        defaultValue: '',
        validation: /^\d+$/,
        required: false
    },

    COT_TYPE: {
        type: 'string',
        description: 'Override COT Event Type ("marker type")',
        defaultValue: '',
        validation: /^[a-zA-Z0-9\-_]*$/,
        requiresQuoting: false,
        required: false
    },

    COT_ICON: {
        type: 'string',
        description: 'Set a custom user icon / custom marker icon in TAK. Contains a Data Package UUID and resource name (file name)',
        defaultValue: '',
        requiresQuoting: false,
        required: false
    },

    COT_CAVEAT: {
        type: 'string',
        description: 'CoT Caveat for the messages, used to indicate special conditions',
        defaultValue: '',
        requiresQuoting: false,
        required: false
    },

    COT_RELTO: {
        type: 'string',
        description: 'CoT RelTo attribute, used to specify the relationship to other messages',
        defaultValue: '',
        requiresQuoting: false,
        required: false
    },

    COT_QOS: {
        type: 'enum',
        description: 'CoT Quality of Service level for the messages',
        defaultValue: 'standard',
        options: ['standard', 'high', 'low'],
        validation: /^(standard|high|low)$/i,
        required: false
    },

    COT_OPEX: {
        type: 'boolean',
        description: 'Indicates if the CoT message is for operational use',
        defaultValue: 'false',
        validation: /^(true|false|yes|no|1|0)$/i,
        required: false
    }
};
