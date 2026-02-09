/**
 * unitone Link Modal Ext - Editor Extension
 *
 * クエリーループブロックにリンクモーダル表示オプションを追加
 */

import { InspectorControls } from '@wordpress/block-editor';
import { createHigherOrderComponent } from '@wordpress/compose';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import {
	PanelBody,
	ToggleControl,
} from '@wordpress/components';

/**
 * クエリーループブロックにdata属性を追加
 */
const useBlockProps = createHigherOrderComponent( ( BlockListBlock ) => {
	return ( props ) => {
		const { attributes, name, wrapperProps } = props;

		if ( 'core/query' !== name ) {
			return <BlockListBlock { ...props } />;
		}

		if ( ! attributes?.unitoneLinkModalExt ) {
			return <BlockListBlock { ...props } />;
		}

		props = {
			...props,
			wrapperProps: {
				...wrapperProps,
				'data-unitone-link-modal-ext': 'true',
			},
		};

		return <BlockListBlock { ...props } />;
	};
}, 'useBlockPropsLinkModalExt' );

addFilter(
	'editor.BlockListBlock',
	'unitone-link-modal-ext/query/useBlockProps',
	useBlockProps
);

/**
 * クエリーループブロックにInspectorControlsを追加
 */
const withInspectorControls = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		if ( ! props.isSelected || 'core/query' !== props.name ) {
			return <BlockEdit { ...props } />;
		}

		const { attributes, setAttributes } = props;
		const { unitoneLinkModalExt } = attributes;

		return (
			<>
				<BlockEdit { ...props } />

				<InspectorControls>
					<PanelBody
						title={ __( 'Link Modal Ext', 'unitone-link-modal-ext' ) }
						initialOpen={ false }
					>
						<ToggleControl
							__nextHasNoMarginBottom
							label={ __( 'Open links in modal', 'unitone-link-modal-ext' ) }
							help={ __( 'Links within this query loop will be displayed in a modal window.', 'unitone-link-modal-ext' ) }
							checked={ !! unitoneLinkModalExt }
							onChange={ ( newValue ) => {
								setAttributes( {
									unitoneLinkModalExt: newValue || undefined,
								} );
							} }
						/>
					</PanelBody>
				</InspectorControls>
			</>
		);
	};
}, 'withInspectorControlsLinkModalExt' );

addFilter(
	'editor.BlockEdit',
	'unitone-link-modal-ext/core/query/with-inspector-controls',
	withInspectorControls
);

/**
 * クエリーループブロックに属性を追加
 */
const addAttributes = ( settings, name ) => {
	if ( 'core/query' !== name ) {
		return settings;
	}

	return {
		...settings,
		attributes: {
			...settings.attributes,
			unitoneLinkModalExt: {
				type: 'boolean',
				default: false,
			},
		},
	};
};

addFilter(
	'blocks.registerBlockType',
	'unitone-link-modal-ext/query/add-attributes',
	addAttributes
);

/**
 * フロントエンド用のdata属性をブロックに追加
 */
const addDataAttribute = ( extraProps, blockType, attributes ) => {
	if ( 'core/query' !== blockType.name ) {
		return extraProps;
	}

	if ( ! attributes?.unitoneLinkModalExt ) {
		return extraProps;
	}

	return {
		...extraProps,
		'data-unitone-link-modal-ext': 'true',
	};
};

addFilter(
	'blocks.getSaveContent.extraProps',
	'unitone-link-modal-ext/query/add-data-attribute',
	addDataAttribute
);
