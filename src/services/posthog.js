import posthog from 'posthog-js';

const POSTHOG_KEY = process.env.REACT_APP_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.REACT_APP_PUBLIC_POSTHOG_HOST;

if (POSTHOG_KEY) {
    posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST || 'https://app.posthog.com',
        loaded: (posthog) => {
            if (process.env.NODE_ENV === 'development') posthog.debug();
        },
        autocapture: true,
        capture_pageview: true,
        persistence: 'localStorage',
        disable_session_recording: false,
        enable_recording_console: true
    });
}

export default posthog; 