import log from 'loglevel';

if (process.env.NODE_ENV === 'production') {
    log.setLevel('error');
} else {
    log.setLevel('debug');
}

if (typeof window !== 'undefined') {
    log.methodFactory = (methodName, level, loggerName) => {
        const originalMethod = log.methodFactory(methodName, level, loggerName);

        return (...args: any[]) => {
            if (level) {
                console.error(`Remote logging for errors: ${methodName}`, ...args);
            }
            originalMethod(...args);
        };
    };
}

export default log;
