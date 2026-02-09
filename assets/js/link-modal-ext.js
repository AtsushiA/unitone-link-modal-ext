/**
 * unitone Link Modal Ext
 *
 * リンク先をモーダル（iframe）で表示する機能を提供します。
 * data-unitone-media-type="external" を持つ .unitone-media-link をクリックすると、
 * リンク先をiframe内でモーダル表示します。
 */
document.addEventListener('DOMContentLoaded', () => {
	const overlay = document.querySelector('.unitone-link-modal-ext-overlay');
	if (!overlay) {
		return;
	}

	const scrim = overlay.querySelector('.unitone-link-modal-ext-overlay__scrim');
	const closeButton = overlay.querySelector('.unitone-link-modal-ext-overlay__close');
	const loading = overlay.querySelector('.unitone-link-modal-ext-overlay__loading');
	const container = overlay.querySelector('.unitone-link-modal-ext-overlay__container');
	const iframe = overlay.querySelector('.unitone-link-modal-ext-overlay__iframe');
	const externalLink = overlay.querySelector('.unitone-link-modal-ext-overlay__external-link');

	// テーマ側のライトボックス
	const themeOverlay = document.querySelector('.unitone-lightbox-overlay');

	let previousActiveElement = null;
	let lastClickedUrl = null; // 最後にクリックされたURL

	/**
	 * モーダルを開く（リンククリック時にiframeを読み込む）
	 *
	 * @param {string} url - 表示するURL
	 * @param {string} title - iframeのタイトル
	 */
	const openModal = (url, title = '') => {
		if (!url) {
			return;
		}

		// 現在のフォーカス要素を保存
		const doc = overlay.ownerDocument || document;
		const activeEl = doc?.activeElement && doc.activeElement !== doc.body ? doc.activeElement : null;
		previousActiveElement = activeEl;

		// ローディング表示
		loading.classList.add('is-loading');
		container.classList.remove('is-loaded');

		// モーダルを表示
		overlay.classList.add('is-active');
		overlay.setAttribute('aria-hidden', 'false');
		overlay.setAttribute('aria-modal', 'true');
		overlay.setAttribute('role', 'dialog');

		// body のスクロールを無効化
		document.body.style.overflow = 'hidden';

		// フォーカスを閉じるボタンに移動
		closeButton?.focus();

		// 外部リンクのhrefを設定
		if (externalLink) {
			externalLink.href = url;
		}

		// iframeのタイトルを設定
		if (iframe) {
			iframe.title = title || url;
			// クリック時にiframeのsrcを設定して読み込み開始
			iframe.src = url;
		}
	};

	/**
	 * モーダルを閉じる
	 */
	const closeModal = () => {
		// モーダルを非表示
		overlay.classList.remove('is-active');
		overlay.setAttribute('aria-hidden', 'true');
		overlay.removeAttribute('aria-modal');
		overlay.removeAttribute('role');

		// body のスクロールを有効化
		document.body.style.overflow = '';

		// iframeをクリア（読み込み停止）
		if (iframe) {
			iframe.src = 'about:blank';
			iframe.title = '';
		}

		if (externalLink) {
			externalLink.href = '';
		}

		// ローディング状態をリセット
		loading.classList.remove('is-loading');
		container.classList.remove('is-loaded');

		// 元のフォーカス要素に戻る
		if (previousActiveElement) {
			previousActiveElement.focus();
			previousActiveElement = null;
		}
	};

	/**
	 * 外部URLかどうかを判定
	 *
	 * @param {string} url - チェックするURL
	 * @return {boolean} 外部URLの場合はtrue
	 */
	const isExternalUrl = (url) => {
		try {
			const linkUrl = new URL(url, window.location.origin);
			return linkUrl.origin !== window.location.origin;
		} catch (e) {
			return false;
		}
	};

	/**
	 * YouTubeのURLかどうかを判定
	 *
	 * @param {string} url - チェックするURL
	 * @return {boolean} YouTubeのURLの場合はtrue
	 */
	const isYouTubeUrl = (url) => {
		try {
			const linkUrl = new URL(url, window.location.origin);
			const hostname = linkUrl.hostname.toLowerCase();
			return (
				hostname === 'youtube.com' ||
				hostname === 'www.youtube.com' ||
				hostname === 'youtu.be' ||
				hostname === 'm.youtube.com' ||
				hostname === 'music.youtube.com'
			);
		} catch (e) {
			return false;
		}
	};

	// iframe読み込み完了時
	if (iframe) {
		iframe.addEventListener('load', () => {
			if (iframe.src && iframe.src !== '' && iframe.src !== 'about:blank') {
				loading.classList.remove('is-loading');
				container.classList.add('is-loaded');
			}
		});

		// iframe読み込みエラー時
		iframe.addEventListener('error', () => {
			loading.classList.remove('is-loading');
			container.classList.add('is-loaded');
		});
	}

	/**
	 * テーマ側のライトボックスが開いた時にiframeのvisibilityを修正（YouTube以外）
	 */
	const fixThemeOverlayIframe = () => {
		if (!themeOverlay) return;

		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
					if (themeOverlay.classList.contains('active')) {
						// 最後にクリックされたURLがYouTubeの場合は修正しない
						if (lastClickedUrl && isYouTubeUrl(lastClickedUrl)) {
							return;
						}

						// embed コンテナ内のiframeを取得
						const embedContainer = themeOverlay.querySelector('.unitone-lightbox-embed-container');
						if (embedContainer) {
							const embedIframe = embedContainer.querySelector('iframe.wp-embedded-content');
							if (embedIframe) {
								// visibility: hidden を解除
								embedIframe.style.position = 'static';
								embedIframe.style.visibility = 'visible';
								embedIframe.style.width = '100%';
								embedIframe.style.height = '100%';
							}

							// ブログカードを非表示
							const blogCard = embedContainer.querySelector('.wp-oembed-blog-card');
							if (blogCard) {
								blogCard.style.display = 'none';
							}
						}
					}
				}
			});
		});

		observer.observe(themeOverlay, { attributes: true });
	};

	// テーマのライトボックスのiframe修正を有効化
	fixThemeOverlayIframe();

	/**
	 * クエリーループブロック内のリンクかどうかを判定
	 *
	 * @param {Element} element - チェックする要素
	 * @return {boolean} クエリーループブロック内でモーダル表示が有効な場合はtrue
	 */
	const isInQueryLoopWithModal = (element) => {
		const queryLoop = element.closest('[data-unitone-link-modal-ext="true"]');
		return !!queryLoop;
	};

	/**
	 * 有効なURLかどうかを判定（javascript:やmailto:などを除外）
	 *
	 * @param {string} url - チェックするURL
	 * @return {boolean} 有効なURLの場合はtrue
	 */
	const isValidUrl = (url) => {
		if (!url) return false;
		// javascript:, mailto:, tel:, # などを除外
		if (url.startsWith('javascript:') || url.startsWith('mailto:') || url.startsWith('tel:') || url === '#' || url.startsWith('#')) {
			return false;
		}
		return true;
	};

	// クリックイベント（キャプチャフェーズでテーマより先に処理）
	document.addEventListener('click', (event) => {
		// クエリーループブロック内のリンクをチェック
		const queryLoopLink = event.target.closest('a[href]');
		if (queryLoopLink && isInQueryLoopWithModal(queryLoopLink)) {
			const url = queryLoopLink.getAttribute('href');

			// クリックされたURLを保存
			lastClickedUrl = url;

			// 無効なURLの場合はスキップ
			if (!isValidUrl(url)) {
				return;
			}

			// YouTubeのURLの場合はスキップ
			if (isYouTubeUrl(url)) {
				return;
			}

			// すべてのリンクをモーダルで表示
			event.preventDefault();
			event.stopPropagation();
			event.stopImmediatePropagation();
			const title = queryLoopLink.textContent?.trim() || '';
			openModal(url, title);
			return;
		}

		// 従来の .unitone-media-link の処理
		const link = event.target.closest('.unitone-media-link');
		if (!link) {
			return;
		}

		const mediaType = link.dataset?.unitoneMediaType;

		const url = link.getAttribute('href');

		// クリックされたURLを保存
		lastClickedUrl = url;

		// YouTubeのURLの場合はテーマ標準機能を使用
		if (url && isYouTubeUrl(url)) {
			return;
		}

		// data-unitone-media-type="external" の場合
		if (mediaType === 'external') {
			event.preventDefault();
			event.stopPropagation();
			event.stopImmediatePropagation();
			const title = link.dataset?.unitoneMediaAlt || link.textContent?.trim() || '';
			openModal(url, title);
			return;
		}

		// data-unitone-media-type が指定されていない場合、外部URLなら外部モーダルで表示
		if (!mediaType || mediaType === '') {
			if (url && isExternalUrl(url)) {
				event.preventDefault();
				event.stopPropagation();
				event.stopImmediatePropagation();
				const title = link.dataset?.unitoneMediaAlt || link.textContent?.trim() || '';
				openModal(url, title);
			}
		}
	}, true); // キャプチャフェーズで登録

	// 閉じるボタンのクリック
	closeButton?.addEventListener('click', closeModal);

	// スクリムのクリック
	scrim?.addEventListener('click', closeModal);

	// Escキーで閉じる
	window.addEventListener('keydown', (event) => {
		if (!overlay.classList.contains('is-active')) {
			return;
		}

		if (event.defaultPrevented) {
			return;
		}

		if (event.key === 'Escape') {
			event.preventDefault();
			closeModal();
			return;
		}

		// Tabキーでフォーカスをトラップ
		if (event.key === 'Tab') {
			event.preventDefault();
			if (document.activeElement === closeButton) {
				externalLink?.focus();
			} else {
				closeButton?.focus();
			}
		}
	});
});
