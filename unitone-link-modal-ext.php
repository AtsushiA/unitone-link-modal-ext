<?php
/**
 * Plugin Name: unitone Link Modal Ext
 * Plugin URI: https://github.com/inc2734/unitone
 * Description: unitone テーマのメディアリンク機能を拡張し、リンク先をモーダル（iframe）で表示できるようにします。
 * Version: 1.0.0
 * Requires at least: 6.0
 * Requires PHP: 7.4
 * Author: NExT-Season
 * License: GPL-2.0-or-later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: unitone-link-modal-ext
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'UNITONE_LINK_MODAL_EXT_VERSION', '1.0.0' );
define( 'UNITONE_LINK_MODAL_EXT_PATH', plugin_dir_path( __FILE__ ) );
define( 'UNITONE_LINK_MODAL_EXT_URL', plugin_dir_url( __FILE__ ) );

/**
 * スクリプトとスタイルを読み込む
 */
function unitone_link_modal_ext_enqueue_assets() {
	// unitone テーマがアクティブでない場合は読み込まない
	$theme = wp_get_theme();
	if ( 'unitone' !== $theme->get_template() && 'unitone' !== $theme->get( 'Name' ) ) {
		return;
	}

	wp_enqueue_style(
		'unitone-link-modal-ext',
		UNITONE_LINK_MODAL_EXT_URL . 'assets/css/style.css',
		array(),
		UNITONE_LINK_MODAL_EXT_VERSION
	);

	wp_enqueue_script(
		'unitone-link-modal-ext',
		UNITONE_LINK_MODAL_EXT_URL . 'assets/js/link-modal-ext.js',
		array(),
		UNITONE_LINK_MODAL_EXT_VERSION,
		true
	);
}
add_action( 'wp_enqueue_scripts', 'unitone_link_modal_ext_enqueue_assets' );

/**
 * エディター用スクリプトを読み込む
 */
function unitone_link_modal_ext_enqueue_editor_assets() {
	// unitone テーマがアクティブでない場合は読み込まない
	$theme = wp_get_theme();
	if ( 'unitone' !== $theme->get_template() && 'unitone' !== $theme->get( 'Name' ) ) {
		return;
	}

	$asset_file = UNITONE_LINK_MODAL_EXT_PATH . 'build/index.asset.php';
	if ( ! file_exists( $asset_file ) ) {
		return;
	}

	$asset = include $asset_file;

	wp_enqueue_script(
		'unitone-link-modal-ext-editor',
		UNITONE_LINK_MODAL_EXT_URL . 'build/index.js',
		$asset['dependencies'],
		$asset['version'],
		true
	);

	wp_set_script_translations(
		'unitone-link-modal-ext-editor',
		'unitone-link-modal-ext'
	);
}
add_action( 'enqueue_block_editor_assets', 'unitone_link_modal_ext_enqueue_editor_assets' );

/**
 * モーダルオーバーレイHTMLを追加
 */
function unitone_link_modal_ext_add_overlay() {
	// unitone テーマがアクティブでない場合は追加しない
	$theme = wp_get_theme();
	if ( 'unitone' !== $theme->get_template() && 'unitone' !== $theme->get( 'Name' ) ) {
		return;
	}
	?>
	<div class="unitone-link-modal-ext-overlay" aria-hidden="true" tabindex="-1">
		<div class="unitone-link-modal-ext-overlay__scrim"></div>
		<button type="button" class="unitone-link-modal-ext-overlay__close" aria-label="<?php esc_attr_e( 'Close', 'unitone-link-modal-ext' ); ?>">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
				<path d="M13 11.8l6.1-6.3-1-1-6.1 6.2-6.1-6.2-1 1 6.1 6.3-6.5 6.7 1 1 6.5-6.6 6.5 6.6 1-1z"></path>
			</svg>
		</button>
		<div class="unitone-link-modal-ext-overlay__loading">
			<div class="unitone-link-modal-ext-overlay__spinner"></div>
		</div>
		<div class="unitone-link-modal-ext-overlay__container">
			<iframe class="unitone-link-modal-ext-overlay__iframe" src="about:blank" title="" sandbox="allow-scripts allow-same-origin allow-forms allow-popups"></iframe>
		</div>
		<a href="" target="_blank" rel="noopener noreferrer" class="unitone-link-modal-ext-overlay__external-link">
			<?php esc_html_e( 'Open in new tab', 'unitone-link-modal-ext' ); ?>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
				<path d="M18.2 17c0 .7-.6 1.2-1.2 1.2H7c-.7 0-1.2-.6-1.2-1.2V7c0-.7.6-1.2 1.2-1.2h3.2V4.2H7C5.5 4.2 4.2 5.5 4.2 7v10c0 1.5 1.2 2.8 2.8 2.8h10c1.5 0 2.8-1.2 2.8-2.8v-3.6h-1.5V17zM14.9 3v1.5h3.7l-6.4 6.4 1.1 1.1 6.4-6.4v3.7h1.5V3h-6.3z"></path>
			</svg>
		</a>
	</div>
	<?php
}
add_action( 'wp_footer', 'unitone_link_modal_ext_add_overlay' );
