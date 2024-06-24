import { translations } from "./translations"
import secureLocalStorage from 'react-secure-storage'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

export const dateFormat = (dateObj) => {
    if (dateObj) {
        let year = dateObj.getFullYear(),
            month = dateObj.getMonth() + 1,
            date = dateObj.getDate();

        return year + "-" + ("00" + month).slice(-2) + "-" + ("00" + date).slice(-2);
    } else {
        return null;
    }
};

export const dateRange = (startDate, endDate) => {
    let dates = [];
    if (startDate && endDate) {
        let currentDate = startDate;
        const addDays = function (days) {
            const date = new Date(this.valueOf());
            date.setDate(date.getDate() + days);
            return date;
        };
        while (currentDate <= endDate) {
            dates.push(currentDate);
            currentDate = addDays.call(currentDate, 1);
        }
        return dates;
    } else {
        return dates;
    }
};

export const dateInArray = (dates, checkDate) => {
    let isInArray = false;
    if (dates && dates.length > 0 && checkDate) {
        for (var i = 0; i < dates.length; i++) {
            let dateObj = dates[i];
            if (dateObj instanceof Date && checkDate instanceof Date) {
                if (dates[i].getTime() === checkDate.getTime()) {
                    isInArray = true;
                    break;
                }
            }
        }
        return isInArray;
    } else {
        return isInArray;
    }
};

export const timeDateFormat = (date) => {
    var month = "00" + (date.getMonth() + 1);
    var day = "00" + date.getDate();
    var hours = "00" + date.getHours();
    var minutes = "00" + date.getMinutes();
    var seconds = "00" + date.getSeconds();
    var dateValue = date.getFullYear() + '.' + month.slice(-2) + '.' + day.slice(-2) + " " + hours.slice(-2) + ':' + minutes.slice(-2) + ":" + seconds.slice(-2);
    return dateValue;
}

export const secondsToHms = (d) => {
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? ":" : ":") : "00:";
    var mDisplay = m > 0 ? m + (m == 1 ? ":" : ":") : "00:";
    var sDisplay = s > 0 ? s + (s == 1 ? ":" : "") : "00";

    return hDisplay + (parseInt(mDisplay) > 0 && parseInt(mDisplay) < 10 ? ('0' + mDisplay) : mDisplay) + (parseInt(sDisplay) > 0 && parseInt(sDisplay) < 10 ? ('0' + sDisplay) : sDisplay);
}

export const secondsToHmsWord = (d) => {
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? ":" : ":") : "00:";
    var mDisplay = m > 0 ? m + (m == 1 ? ":" : ":") : "00:";
    var sDisplay = s > 0 ? s + (s == 1 ? ":" : "") : "00";

    return hDisplay + (parseInt(mDisplay) > 0 && parseInt(mDisplay) < 10 ? ('0' + mDisplay) : mDisplay) + (parseInt(sDisplay) > 0 && parseInt(sDisplay) < 10 ? ('0' + sDisplay) : sDisplay);
}

export const hexToRgb = (hex) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

export const isValidDate = (str) => {
    if (!str) {
        return false;
    }
    var m = str.match(/^(\d{4})\-(\d{1,2})\-(\d{1,2})$/);
    return (m) ? new Date(m[1], m[2] - 1, m[3]) : null;
}

export const priceFormat = (price) => {
    if (price) {
        return Number.parseInt(price).toFixed().replace(/(\d)(?=(\d{3})+(,|$))/g, '$1\'');
    } else {
        return 0;
    }
};

export const secondFormat = (seconds) => {
    if (seconds) {
        let day = 0;
        let hour = 0;
        let minute = 0;
        let second = 0;
        if (seconds > 86400) {
            day = parseInt(seconds / 86400);
        }
        const hourSec = seconds - day * 86400;
        if (hourSec > 3600) {
            hour = parseInt(hourSec / 3600, 0);
        }

        let minSec = seconds - day * 86400 - hour * 3600;
        if (minSec > 60) {
            minute = parseInt(minSec / 60, 0)
            second = minSec - minute * 60;
        } else {
            second = minSec;
        }

        if (day > 0) {
            return day + '' + translations(locale)?.common?.day + ' '
                + hour + '' + translations(locale)?.common?.hour + ' '
                + minute + '' + translations(locale)?.common?.min
        } else {
            if (hour > 0) {
                return hour + '' + translations(locale)?.common?.hour + ' '
                    + minute + '' + translations(locale)?.common?.min
            } else {
                return minute + '' + translations(locale)?.common?.min
            }
        }
    } else {
        return null;
    }
};

export const secondMinuteFormat = (seconds) => {
    if (seconds) {
        let minute = parseInt(seconds / 60, 0);
        return numberFormat(minute) + '' + translations(locale)?.common?.min
    } else {
        return null;
    }
};

export const numberFormat = (number) => {
    if (number) {
        return Number.parseInt(number).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
        return 0;
    }
};

export const numberReverseFormat = (str, find, replace) => {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function escapeRegExp(string) {
    return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export const floatFormat = (floatNumber, digit = 2) => {
    if (floatNumber) {
        let splitNumbers = floatNumber.toString().split(".");

        if (splitNumbers.length === 2) {
            return floatNumber.toFixed(digit);
        } else {
            return splitNumbers[0];
        }
    } else {
        return 0;
    }
};

export const isFloat = (number) => {
    if (typeof parseInt(number) === 'number') {
        if (number % 1 === 0) {
            // int
            return false;
        } else {
            // float
            return true;
        }
    } else {
        // not number
        return false;
    }
};

export const isValidURL = (str) => {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}

export const linkify = (inputText, linkColor = 'white') => {
    var replacedText, replacePattern1, replacePattern2, replacePattern3;

    //URLs starting with http://, https://, or ftp://
    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank" style="color: ' + linkColor + ';">$1</a>');

    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank" style="color: ' + linkColor + ';">$2</a>');

    //Change email addresses to mailto:: links.
    replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
    replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1" style="color: ' + linkColor + ';">$1</a>');

    replacedText = replacedText.replace(/\n/g, "<br />");

    return replacedText;
}

export const queryUrl = (url, lowerCase = true) => {
    var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

    // we'll store the parameters here
    var obj = {};

    // if query string exists
    if (queryString) {

        // stuff after # is not part of query string, so get rid of it
        queryString = queryString.split('#')[0];

        // split our query string into its component parts
        var arr = queryString.split('&');

        for (var i = 0; i < arr.length; i++) {
            // separate the keys and the values
            var a = arr[i].split('=');

            // set parameter name and value (use 'true' if empty)
            var paramName = a[0];
            var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

            // (optional) keep case consistent
            paramName = paramName.toLowerCase();
            if (typeof paramValue === 'string' && lowerCase) {
                paramValue = paramValue.toLowerCase();
            }

            // if the paramName ends with square brackets, e.g. colors[] or colors[2]
            if (paramName.match(/\[(\d+)?\]$/)) {

                // create key if it doesn't exist
                var key = paramName.replace(/\[(\d+)?\]/, '');
                if (!obj[key]) obj[key] = [];

                // if it's an indexed array e.g. colors[2]
                if (paramName.match(/\[\d+\]$/)) {
                    // get the index value and add the entry at the appropriate position
                    var index = /\[(\d+)\]/.exec(paramName)[1];
                    obj[key][index] = paramValue;
                } else {
                    // otherwise add the value to the end of the array
                    obj[key].push(paramValue);
                }
            } else {
                // we're dealing with a string
                if (!obj[paramName]) {
                    // if it doesn't exist, create property
                    obj[paramName] = paramValue;
                } else if (obj[paramName] && typeof obj[paramName] === 'string') {
                    // if property does exist and it's a string, convert it to an array
                    obj[paramName] = [obj[paramName]];
                    obj[paramName].push(paramValue);
                } else {
                    // otherwise add the property
                    obj[paramName].push(paramValue);
                }
            }
        }
    }

    return obj;
};

export const youtubeUrl = (url) => {
    var regExp = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/;
    var match = url.match(regExp);
    return (match && match[1].length == 11) ? match[1] : false;
}

export const htmlDecode = (input) => {
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
};

const maxUploadSize = 25;
export const isLargerFile = (sizeInByte) => {
    if (sizeInByte && sizeInByte > 1024) {
        let kb = Math.floor(sizeInByte / 1024);
        let byte = sizeInByte - 1024 * kb;
        if (kb > 1024) {
            let mb = Math.floor(kb / 1024);
            if (mb > maxUploadSize) {
                // larger than 25
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    } else {
        return false
    }
};


export const isNumberInput = (value) => {
    const re = /^[0-9\b]+$/;
    return value === '' || re.test(value);
}

export const capitalize = string => {
    if (typeof string === 'string' && string.length) {
        return `${string[0].toUpperCase()}${string.substring(1).toLowerCase()}`;
    } else {
        return string;
    }
}

export const replaceAnchors = string => {
    if (string && typeof string === 'string') {
        const re = /<a[^>]*>([^<]+)<\/a>/g;
        const href_re = /href="([^"]*)/;
        const absoluteUrlRe = /^https?:\/\/|^\/\//i;
        return string.replace(re, function (stringA) {
            return stringA.replace(href_re, function (stringHref, href) {
                const url = absoluteUrlRe.test(href) ? href : `https://${href}`;
                return `href="${url}" target="_blank" rel="noreferrer noopener"`;
            })
        });
    }
    return '';
}

export const getDateRange = (start, end) => {
    if (start && end) {
        if (start === end) {
            return [start];
        }
        const dates = [];
        const sd = new Date(start);
        const ed = new Date(end);
        if (sd < ed) {
            for (const d = sd; d <= ed; d.setDate(d.getDate() + 1)) {
                dates.push(new Date(d));
            }
        }
        return dates;
    }
    return [];
};

export const getFileSize = size => {
    if (size === 0)
        return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];

    const i = Math.floor(Math.log(size) / Math.log(k));
    return `${parseFloat((size / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export const getGender = gender => {
    switch (gender?.toString()?.toLowerCase()) {
        case 'f':
            return translations(locale)?.female
        case 'm':
            return translations(locale)?.male
        default:
            return '-'
    }
}

export const getGenderOptions = [
    {
        value: 'F',
        text: translations(locale)?.female
    },
    {
        value: 'M',
        text: translations(locale)?.male
    }
]

export const paginate = (array = [], { page = 1, pageSize = 10, search = '', sort = 'id', order = 'asc' }) => {
    const filteredArray = array
        ?.filter(el =>
            Object.keys(el)?.some(key =>
                key != 'id' && el?.[key]?.toString()?.toLowerCase()?.includes(search?.toLowerCase())
            )
        )
        ?.sort((a, b) => {
            const fieldA = a?.[sort]?.toString()
            const fieldB = b?.[sort]?.toString()
            if (order === 'asc')
                return fieldA?.localeCompare(fieldB, undefined, { numeric: true, sensitivity: 'base' })
            else if (order === 'desc')
                return fieldB?.localeCompare(fieldA, undefined, { numeric: true, sensitivity: 'base' })
        })
    return {
        data: filteredArray?.slice((page - 1) * pageSize, page * pageSize),
        length: filteredArray?.length
    }
}

export const isValidEmail = (email = '') => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

export const getCrud = (schoolObj = null, selectedRoute = null, crudKey = null) => {
    if (schoolObj) {
        if (schoolObj?.operator === 1) {
            return true
        } else {
            const crudJson = schoolObj?.modules?.find(obj => obj.path === selectedRoute)?.crud || null;
            if (crudJson && crudJson?.length > 0) {
                const crud = JSON.parse(crudJson);
                if (crud[crudKey] && crud[crudKey]?.length > 0) {
                    let inArray = false;
                    for (let r = 0; r < crud[crudKey]?.length; r++) {
                        if (schoolObj.roles?.indexOf(crud[crudKey][r]?.value) > -1) {
                            inArray = true;
                            break;
                        }
                    }
                    return inArray;
                } else {
                    return true;
                }
            } else {
                return true
            }
        }
    } else {
        return false;
    }
}