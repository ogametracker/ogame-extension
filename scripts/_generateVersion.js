const { format } = require("date-fns");

module.exports = {
    generateVersion: () => {
        const now = new Date();
        return `${format(now, 'yyyy')
            }.${format(now, 'M')
            }.${format(now, 'd')
            }.${format(now, 'k')}${format(now, 'mm')}${Math.trunc(now.getSeconds() / 10)}`;
    },
};