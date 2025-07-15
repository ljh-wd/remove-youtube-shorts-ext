// TODO: Remove any shorts from playlists such as watch later etc.
import { removeElements } from "./utils";

function removeShorts() {
    removeElements('ytd-rich-section-renderer', section => {
        const title = section.querySelector('h2');
        return !!(title && title.innerText.toLowerCase().includes('shorts'));
    });
}

function removeSidebarShorts() {
    removeElements('ytd-guide-entry-renderer', entry => {
        const textContent = entry.textContent?.toLowerCase().trim();
        return !!(textContent && textContent.includes('shorts'));
    });
}

function removeMobileShorts() {
    removeElements('a', link => link.textContent?.toLowerCase().trim() === 'shorts');
}

function removeResponsiveShorts() {
    removeElements('*', el => el.textContent?.trim().toLowerCase() === 'shorts',
        'ytd-mini-guide-entry-renderer, ytd-guide-entry-renderer, tp-yt-paper-item, a');
}

function removeSearchShorts() {
    removeElements('yt-section-header-view-model, yt-shelf-header-layout', undefined,
        'ytd-item-section-renderer, ytd-shelf-renderer, .ytSectionHeaderViewModelHost, .shelf-header-layout-wiz');
    removeElements('.ytGridShelfViewModelGridShelfRow');
    removeElements('ytm-shorts-lockup-view-model-v2, ytm-shorts-lockup-view-model');
    removeElements('a[href^="/shorts/"]', undefined,
        'ytd-video-renderer, ytd-grid-video-renderer, ytd-rich-item-renderer, .ytGridShelfViewModelGridShelfItem, .shortsLockupViewModelHost');
    removeElements('h2, h3, span', el => el.textContent?.trim().toLowerCase() === 'shorts',
        'ytd-item-section-renderer, ytd-shelf-renderer, .ytGridShelfViewModelGridShelfRow, .ytSectionHeaderViewModelHost');
    removeElements('ytd-reel-shelf-renderer, ytd-reel-item-renderer');
    removeElements('grid-shelf-view-model.ytGridShelfViewModelHost');
}

function cleanYouTube() {
    removeShorts();
    removeSidebarShorts();
    removeMobileShorts();
    removeResponsiveShorts();
    removeSearchShorts();
}

function startObserver() {
    if (!document.body) {
        return setTimeout(startObserver, 10);
    }
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

cleanYouTube();

let debounceTimeout: number | null = null;

const observer = new MutationObserver(() => {
    if (debounceTimeout) clearTimeout(debounceTimeout);
    debounceTimeout = window.setTimeout(() => {
        cleanYouTube();
    }, 100);
});

startObserver();
