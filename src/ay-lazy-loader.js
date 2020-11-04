'use strict';
export default class AyLazyLoader {

    /**
     * Constructor
     *
     * @param options
     *
     * options Defaults:
     *
     * selectorClass:  A css class to detect lazy items.
     * Default -> '.lazy'
     * This class is removed automatically when item is detected and observed!
     *
     * rootMargin: Viewport margins for intersection detection.
     * Higher pixels make items loaded  early.
     * Defaults -> '200px 20px 200px 20px'
     *
     * showImagesAfterLoaded: true
     * Set this option false, if you want to set src before loading image.
     *
     * autoDetectItemsFromAjaxRequests: true
     * Set to false, if you want to manually detect new items from ajax contents.
     * @see detectItems
     *
     */
	constructor(options) {
		const opts = options || {};

		this.selectorClass = opts.selectorClass || '.lazy';
		this.rootMargin = opts.rootMargin || '200px 20px 200px 20px';
		this.showImagesAfterLoaded = opts.showImagesAfterLoaded || true;
		this.autoDetectItemsFromAjaxRequests = opts.autoDetectItemsFromAjaxRequests || true;

		this._intersectionObserver = new IntersectionObserver(entries => {
			for (let i = 0; i < entries.length; i++) {
				const entry = entries[i];
				if (entry.isIntersecting) {
					const item = entry.target;
					const itemType = item.nodeName.toLowerCase();

					if (itemType === 'img') {
						this._showImage(item);
					} else if (itemType === 'iframe') {
						this._showIframe(item);
					}

					this._intersectionObserver.unobserve(item);
				}
			}
		}, {rootMargin: this.rootMargin});
		this._bindToAjaxRequests();
		document.addEventListener('DOMContentLoaded', () => {
			this._observeItems();
		});
	}

    /**
     * Shows a image which is intersected.
     *
     * @param item Image to show.
     * @private
     */
	_showImage(item) {
		if (this.showImagesAfterLoaded) {
			const tmpImage = new Image();
			tmpImage.onload = () => {
				item.src = tmpImage.src;
				item.removeAttribute('data-src');
				if (item.getAttribute('data-sizes') !== null) {
					item.sizes = item.getAttribute('data-sizes');
					item.removeAttribute('data-sizes');
				}
				if (item.getAttribute('data-srcset') !== null) {
					item.srcset = item.getAttribute('data-srcset');
					item.removeAttribute('data-srcset');
				}
			};
			tmpImage.src = item.getAttribute('data-src');
		} else {
			item.src = item.getAttribute('data-src');
			item.removeAttribute('data-src');
			if (item.getAttribute('data-sizes') !== null) {
				item.sizes = item.getAttribute('data-sizes');
				item.removeAttribute('data-sizes');
			}
			if (item.getAttribute('data-srcset') !== null) {
				item.srcset = item.getAttribute('data-srcset');
				item.removeAttribute('data-srcset');
			}
		}
	}

    /**
     * Shows a iframe which is intersected.
     *
     * @param item Iframe to show.
     * @private
     */
	_showIframe(item) {
		item.src = item.getAttribute('data-src');
		item.removeAttribute('data-src');
	}

    /**
     * Binds an event to ajax completions, so we detect and observe new lazy items
     * which came from ajax content.
     * @private
     */
	_bindToAjaxRequests() {
		if (this.autoDetectItemsFromAjaxRequests) {
			const _this = this;
			const send = XMLHttpRequest.prototype.send;
			XMLHttpRequest.prototype.send = function () {
				this.addEventListener('load', () => {
					_this._observeItems();
				});
				return send.apply(this, arguments);
			};
		}
	}

    /**
     * Detects and observes lazy items which are not observed before.
     * @private
     */
	_observeItems() {
		const selectorClassName = this.selectorClass.substring(1);
		const items = document.querySelectorAll(this.selectorClass);
		for (let i = 0; i < items.length; i++) {
			const item = items[i];
			item.className = item.className.replace(new RegExp('\\b' + selectorClassName + '\\b', 'gi'), '');
			this._intersectionObserver.observe(item);
		}
	}

    // PUBLIC METHODS//
    /**
     * Detects and observes lazy items which are not observed before.
     *
     * If autoDetectItemsFromAjaxRequests = true then this is triggered automatically
     * after every ajax Request completion. Use it only when you make autoDetectItemsFromAjaxRequests = false.
     *
     * @public
     */
	detectItems() {
		this._observeItems();
	}
}
