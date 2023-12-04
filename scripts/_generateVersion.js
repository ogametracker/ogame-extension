const { format } = require("date-fns");

module.exports = {
    generateVersion: () => {
        const now = new Date();
        const timeFormat = `${format(now, 'H')}${format(now, 'mm')}${Math.trunc(now.getSeconds() / 10)}`;

        return `${format(now, 'yyyy')
            }.${format(now, 'M')
            }.${format(now, 'd')
            }.${removeLeadingZeros(timeFormat)}`;
    },
};

function removeLeadingZeros(s) {
    return s.match(/^0*([^0]+.*)$/)[1];
}