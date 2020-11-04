/*! ay-lazy-loader 1.0.0 - Copyright 2019 Fatih Kızmaz - MIT */
var AyLazyLoader = (function () {
'use strict';

var AyLazyLoader = function AyLazyLoader(options) {
	var this$1 = this;

	var opts = options || {};

	this.selectorClass = opts.selectorClass || '.lazy';
	this.rootMargin = opts.rootMargin || '200px 20px 200px 20px';
	this.showImagesAfterLoaded = opts.showImagesAfterLoaded || true;
	this.autoDetectItemsFromAjaxRequests = opts.autoDetectItemsFromAjaxRequests || true;

	this._intersectionObserver = new IntersectionObserver(function (entries) {
		for (var i = 0; i < entries.length; i++) {
			var entry = entries[i];
			if (entry.isIntersecting) {
				var item = entry.target;
				var itemType = item.nodeName.toLowerCase();

				if (itemType === 'img') {
					this$1._showImage(item);
				} else if (itemType === 'iframe') {
					this$1._showIframe(item);
				}

				this$1._intersectionObserver.unobserve(item);
			}
		}
	}, {rootMargin: this.rootMargin});
	this._bindToAjaxRequests();
	document.addEventListener('DOMContentLoaded', function () {
		this$1._observeItems();
	});
};

    /**
     * Shows a image which is intersected.
     *
     * @param item Image to show.
     * @private
     */
AyLazyLoader.prototype._showImage = function _showImage (item) {
	if (this.showImagesAfterLoaded) {
		var tmpImage = new Image();
		tmpImage.onload = function () {
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
};

    /**
     * Shows a iframe which is intersected.
     *
     * @param item Iframe to show.
     * @private
     */
AyLazyLoader.prototype._showIframe = function _showIframe (item) {
	item.src = item.getAttribute('data-src');
	item.removeAttribute('data-src');
};

    /**
     * Binds an event to ajax completions, so we detect and observe new lazy items
     * which came from ajax content.
     * @private
     */
AyLazyLoader.prototype._bindToAjaxRequests = function _bindToAjaxRequests () {
	if (this.autoDetectItemsFromAjaxRequests) {
		var _this = this;
		var send = XMLHttpRequest.prototype.send;
		XMLHttpRequest.prototype.send = function () {
			this.addEventListener('load', function () {
				_this._observeItems();
			});
			return send.apply(this, arguments);
		};
	}
};

    /**
     * Detects and observes lazy items which are not observed before.
     * @private
     */
AyLazyLoader.prototype._observeItems = function _observeItems () {
		var this$1 = this;

	var selectorClassName = this.selectorClass.substring(1);
	var items = document.querySelectorAll(this.selectorClass);
	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		item.className = item.className.replace(new RegExp('\\b' + selectorClassName + '\\b', 'gi'), '');
		this$1._intersectionObserver.observe(item);
	}
};

    // PUBLIC METHODS//
    /**
     * Detects and observes lazy items which are not observed before.
     *
     * If autoDetectItemsFromAjaxRequests = true then this is triggered automatically
     * after every ajax Request completion. Use it only when you make autoDetectItemsFromAjaxRequests = false.
     *
     * @public
     */
AyLazyLoader.prototype.detectItems = function detectItems () {
	this._observeItems();
};

return AyLazyLoader;

}());
