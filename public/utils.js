let jumentos = [];
let dlVideos = [];
const emojisManual = [];

async function createChatTable(list, tableName) {
    $('#' + tableName).empty();
    $('#' + tableName).parent().find('thead').remove();
    $('#' + tableName).parent().append(`
    <thead>
        <tr>
            <th class="col-1 text-center d-none d-md-table-cell" style="width: 140px";><span>Horário</span></th>
            <th class="col-1 text-center d-none d-md-table-cell" style="width: 70px"><span>Tempo</span></th>
            <th class="col-1 text-center d-md-none"><i class="fa-solid fa-clock"></i></th>
            <th>Usuário</th>
            <th>Mensagem</th>
            <!--<th class="text-center d-none d-md-table-cell"><span>Info.</span></th>
            <th class="text-center d-md-none"><i class="fa-solid fa-info-circle"></i></th>-->
        </tr>
    </thead>
    `);
    list.forEach((res, i) => {
        let e = normalizeObj(res);
        let publishedAt = moment(e.publishedAt).format('DD/MM/YYYY hh:mm:ss');
        let icon = '';
        let auxIcon = jumentos.map(m => m.channelId).indexOf(e.authorChannelId);
        let message = e.messageText; //replaceEmojis(e.messageText, emojisManual);
        let row = $(`<tr data-idusr="${e.authorChannelId}" data-name="${e.displayName}" data-msg="${message}"></tr>`);
        $(row).append(`
                <td class="text-center">
                    <span class="d-none d-md-block">${publishedAt}</span>
                    <i data-bs-title="${publishedAt}" class="d-md-none fa-regular fa-clock"></i>
                    <i data-bs-title="${e.videoTime ? e.videoTime : '...'}" class="d-md-none fa-regular fa-clock"></i>
                </td>`);
        $(row).append(`
                <td class="text-center d-none d-md-table-cell">
                    <span>${e.videoTime}</span>
                </td>`);
        if (e.isChatOwner === 1) {
            icon = '<i class="fa-solid fa-crown text-warning"></i> ';
        }

        if (e.isChatModerator === 1) {
            icon = '<i class="fa-solid fa-wrench"></i> '
        }

        if (e.isChatSponsor === 1) {
            icon = '<i class="fa-solid fa-dollar-sign text-success"></i> '
        }

        if (auxIcon !== -1) {
            icon = `<i class="fa-solid ${jumentos[auxIcon].icon}"></i> `;
        }
        $(row).append(`
                <td class="truncate-td ${e.isChatModerator === 1 || e.isChatOwner === 1 || e.isChatSponsor === 1 ? 'fw-bold' : 'fw-normal'}">
                    <img id="img${e.authorChannelId}" src="${e.profileImageUrl}" onError="this.onerror=null;this.src='./images/image-solid.svg';" data-pictureUrl="${e.profileImageUrl}" />
                    ${icon} 
                    <a target="_blank" href="${e.channelUrl}">${e.displayName}</a>
                </td>`);
        $(row).append(`<td class="text-break">${message}</td>`);
        $('#' + tableName).append(row)
    });
    showTooltip('.fa-clock');
    showTooltip('.fa-users');
}

async function createVideoTable(pList, pTableName, pListName) {
    pList.sort((a, b) => {
        if (a.author < b.author) return -1;
        if (a.author > b.author) return 1;
        if (moment(a.published, 'MM/DD/YYYY') < moment(b.published, 'MM/DD/YYYY')) return -1;
        if (moment(a.published, 'MM/DD/YYYY') > moment(b.published, 'MM/DD/YYYY')) return 1;
        return 0;
    });
    if (pList.length > 0) {
        pList.forEach((e, i) => {
            if (!e.no_chat) {
                $('#' + pListName).append(`
                <li class="d-flex justify-content-between text-truncate">
                    <div class="form-check">
                        <input class="form-check-input form-check-input-sm" type="checkbox" id="checkbox-${e.id}" value="${e.id}">
                        <label class="form-check-label" for="checkbox-${e.id}">${e.published} - <b>${e.author}</b> - ${e.title}</label>
                    </div>
                </li>
            `);
            }
            let row = $(`<tr data-videoId="${e.id}" ></tr>`);
            $(row).append(`
                <td class="text-center">
                    <span class="d-none d-md-block">${e.published}</span>
                    <i title=${e.published} class="d-md-none fa-regular fa-clock"></i>
                </td>`);
            $(row).append(`
                <td class="text-truncate">
                    <a target="_blank" href="${e.channelUrl}"><b>${e.author}</b></a>
                </td>`);
            $(row).append(`
                <td class="text-truncate">
                    <a target="_blank" href="https://www.youtube.com/watch?v=${e.id}">${e.title}</a>
                </td>`);
            // <i class="fa fa-download" id="iDownload"></i>
            // <i class="fa-solid fa-circle-play" id="iPlayVideo"></i>
            const hasVideo = dlVideos.indexOf(`video_${e.id}.mp4`) >= 0 ? '<i class="fa-solid fa-circle-play text-success" id="iPlayVideo"></i>' : '<i class="fa fa-download" id="iDownload"></i>';
            const hasVideoMR = dlVideos.indexOf(`video_${e.id}_maxres.mp4`) >= 0 ? '<i class="fa-solid fa-circle-play text-primary" id="iPlayVideoMax"></i>' : '<span class="fa-stack" style="width: 16px"><i class="fa fa-certificate fa-stack-1x text-warning"></i><i class="fa fa-download fa-stack-1x" id="iDownloadMaxRes"></i></span>';
            const hasChat = e.no_chat ? '<i class="fa fa-comments" style="color: lightgray; cursor: default"></i>' : '<i class="fa fa-comments" id="iComments"></i>';
            $(row).append(`
                <td class="text-center">
                     ${hasChat}
                     ${hasVideo}
                     ${hasVideoMR}
                </td>`);
            $('#' + pTableName).append(row)
        });
    } else {
        $('#' + pTableName).append(`<tr><td colspan='4'>Sem informações</td></tr>`);
    };
    showTooltip('.fa-clock');
}

function replaceEmojis(text, replacements) {
    const regex = /:[^:\s]+:/g;
    const emojisDict = {};
    replacements.forEach(item => {
        const key = Object.keys(item)[0];
        const value = item[key];
        emojisDict[key] = value;
    });
    return text.replace(regex, (match) => {
        const key = match.slice(1, -1);
        const emoji = emojisDict[key] || '💩';
        return emoji;
    });
}

function scrollToBottom(id) {
    var objDiv = document.getElementById(id);
    objDiv.scrollTop = objDiv.scrollHeight;
}

function showTooltip(selector) {
    const tooltipTriggerList = document.querySelectorAll(selector);
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl, {
        'trigger': 'hover',
        'placement': 'top',
        'boundary': 'top'
    }));
}

function translate(char) {
    let diff;
    if (/[A-Z]/.test(char)) {
        diff = "𝗔".codePointAt(0) - "A".codePointAt(0);
    }
    else {
        diff = "𝗮".codePointAt(0) - "a".codePointAt(0);
    }
    return String.fromCodePoint(char.codePointAt(0) + diff);
}

const warningModal = new bootstrap.Modal('#warningModal');
function showModal(pTitle, pText) {
    $('.modal-title').html(`<b>${pTitle}</b>`)
    $('.modal-body').html(pText)
    warningModal.show();
}

function showChannelImage(pTitle, pUrl) {
    $('.modal-title').html(`<b>${pTitle}</b>`)
    $('.modal-body').html(`<img style="width: 100%" src='${pUrl}' onError="this.onerror=null;this.src='./images/image-solid.svg';" />`)
    warningModal.show();
}

const mediaModal = new bootstrap.Modal('#mediaModal');
function showVideo(pTitle, pSrc) {
    $('.modal-title').html(`<b>${pTitle}</b>`)
    $('.modal-body').html(`<video style="width: 100%" controls>
                                <source src="/videos/video_${pSrc}.mp4" type="video/mp4">
                          </video>`)
    mediaModal.show();
}

function normalizeObj(obj) {
    let newMessage = obj.message.replace(/'/g, "\\'");
    newMessage = replaceEmojis(newMessage, emojis)
    let newObj = {
        id: obj.message_id,
        authorChannelId: obj.author.id,
        publishedAt: moment(parseInt(obj.timestamp.toString().substring(0, 13))).format(),
        displayMessage: newMessage,
        isChatModerator: obj.author.badges ? (obj.author.badges === 'Moderator' ? 1 : 0) : 0,
        isChatOwner: obj.author.badges ? (obj.author.badges === 'Owner' ? 1 : 0) : 0,
        isChatSponsor: 0, //obj.author.badges ? (obj.author.badges.substring(0, 6) === 'Member' ? 1 : 0) : 0,
        channelUrl: 'http://www.youtube.com/channel/' + obj.author.id,
        profileImageUrl: obj.author.images,
        displayName: obj.author.name,
        messageText: newMessage,
        liveId: '',
        videoTime: obj.time_text,
    }
    return newObj;
}

function loadImage(id, url) {
    var img = new Image();
    img.src = url;
    img.onload = function () {
        $(id).attr('src', url).show();
        img = null;
    };
}

function createList(pElement, pData, pType, pIncludeAll = 'N') {
    const element = $('#' + pElement);
    element.empty();
    if (pIncludeAll.toUpperCase() === 'Y') {
        element.append(`
            <li class="d-flex justify-content-between">
                <div class="form-check">
                    <input class="form-check-input form-check-input-sm" type="checkbox" id="checkbox-t" value="T">
                    <label class="form-check-label text-truncate" for="checkbox-T"> <b>TODOS</b> </label>
                </div>
            </li> `);
    }
    if (pType.toUpperCase() === 'LIVE') {
        pData.forEach(e => {
            element.append(`
            <li class="d-flex justify-content-between">
                <div class="form-check">
                    <input class="form-check-input form-check-input-sm" type="checkbox" id="checkbox-${e.id}" value="${e.id}">
                    <label class="form-check-label text-truncate label-truncate" for="checkbox-${e.id}"> ${e.publishedAt} - ${e.title} </label>
                </div>
            </li> `);
        });
    }
    // form-check-inline
    if (pType.toUpperCase() === 'AUTHOR') {
        pData.forEach(e => {
            let icon = getIcon(e.author);
            element.append(`
            <li class="d-flex justify-content-between">
                <div class="form-check">
                    <input class="form-check-input form-check-input-sm" type="checkbox" id="checkbox-${e.author.id}" value="${e.author.id}">
                    ${icon}
                    <label class="form-check-label text-truncate label-truncate" for="checkbox-${e.author.id}">  ${e.author.name} (${e.count}) </label>
                </div>
            </li> `);
        });
    }
}

function getIcon(pAuthor) {
    let icon = '';
    console.log(pAuthor.id);
    let iconAux = jumentos.map(m => m.authorChannelId).indexOf(pAuthor.id);
    if (iconAux !== -1) {
        icon = `<i class="fa-solid ${jumentos[iconAux].icon}"></i> `;
    }

    if (pAuthor.isChatOwner === 1) {
        icon += '<i class="fa-solid fa-crown text-warning"></i> ';
    }

    if (pAuthor.isChatModerator === 1) {
        icon += '<i class="fa-solid fa-wrench"></i> ';
    }

    if (pAuthor.isChatSponsor === 1) {
        icon += '<i class="fa-solid fa-dollar-sign text-success"></i> ';
    }

    return icon;
}




