import { a2 as statusExcellent, a3 as statusDisabled, i as alertsPositiveSmall, o as statusNegative, a4 as statusLowWarning, a5 as statusWarning, a6 as statusSevereWarning, a7 as statusDormant, a8 as statusInProgress, a9 as customIcon, aa as alertsInfoSmall, a0 as plus, ab as minus, ac as checkSquare, ad as info } from './index2.js';
import { h } from '@stencil/core/internal/client';
import { g as getBootstrapConfig } from './icon.js';
import { a as sanitizeHtmlSync } from './sanitizeHtml.js';

const getDefaultConfig = (LABEL_HEIGHT_TOP_OR_BOTTOM, LABEL_WIDTH_LEFT_OR_RIGHT, showAxisTooltip, hideAxisTooltip, userAxisConfig, LABEL_TRUNCATE_WIDTH) => {
    return {
        data: [],
        eventListeners: {},
        grid: {
            gapSizes: [6, 8, 10],
            itemSizes: [24, 36, 48],
            iconSizes: [12, 16, 16],
            defaultSize: 36,
        },
        statuses: {
            default: {
                iconAsset: null,
                label: "",
                view: {
                    default: {
                        containerStyle: {
                            background: "var(--base-bg-medium-default, #F7F7F7)",
                            border: "1px solid var(--control-border-default, #889099)",
                        },
                        iconStyle: {},
                    },
                    hover: {
                        containerStyle: {
                            background: "var(--base-bg-medium-hover, #E1E4E8)",
                            border: "1px solid var(--control-border-hover, #3E84E5)",
                        },
                        iconStyle: {},
                    },
                    disabled: {
                        containerStyle: {
                            background: "var(--base-bg-medium-default, #F7F7F7)",
                            border: "1px solid var(--control-border-default, #889099)",
                        },
                        iconStyle: {},
                    },
                    focused: {
                        containerStyle: {
                            background: "var(--base-bg-medium-default, #F7F7F7)",
                            border: "1px solid var(--control-border-hover, #3E84E5)",
                            filter: "drop-shadow(0px 0px 4px var(--EffectsFocus-outer, #3E84E5))",
                        },
                        iconStyle: {},
                    },
                },
                edit: {
                    default: {
                        containerStyle: {
                            background: "var(--base-bg-medium-default, #F7F7F7)",
                            border: "1px dashed var(--control-border-default, #889099)",
                        },
                        iconStyle: {},
                    },
                    hover: {
                        containerStyle: {
                            background: "var(--base-bg-medium-hover, #E1E4E8)",
                            border: "1px solid var(--control-border-hover, #3E84E5)",
                        },
                        iconStyle: {},
                    },
                    selected: {
                        containerStyle: {
                            background: "var(--base-bg-medium-active, #F0F1F2)",
                            border: "3px solid var(--control-border-active, #3E84E5)",
                        },
                        iconStyle: {},
                    },
                    "selected-hover": {
                        containerStyle: {
                            background: "var(--base-bg-medium-hover, #E1E4E8)",
                            border: "3px solid var(--control-border-hover, #3E84E5)",
                        },
                        iconStyle: {},
                    },
                },
            },
            excellent: {
                iconAsset: statusExcellent,
                iconName: "status-excellent",
                label: "Excellent",
                view: {
                    default: {
                        containerStyle: {
                            background: "var(--excellent-bg-medium-default, #E3EEFF)",
                            border: "0",
                        },
                        iconStyle: {
                            color: "var(--excellent-icon-default, #1D69CC)",
                        },
                    },
                    hover: {
                        containerStyle: {
                            background: "var(--excellent-bg-medium-hover, #E3EEFF)",
                            border: "1px solid var(--control-border-hover, #3E84E5)",
                        },
                        iconStyle: {
                            color: "var(--excellent-icon-default, #1D69CC)",
                        },
                    },
                    focused: {
                        containerStyle: {
                            background: "var(--excellent-bg-medium-hover, #E3EEFF)",
                            border: "1px solid var(--control-border-hover, #3E84E5)",
                            filter: "drop-shadow(0px 0px 4px var(--EffectsFocus-outer, #3E84E5))",
                        },
                        iconStyle: {
                            color: "var(--excellent-icon-default, #1D69CC)",
                        },
                    },
                },
                edit: {
                    default: {
                        containerStyle: {
                            background: "var(--excellent-bg-medium-default, #E3EEFF)",
                            border: "1px dashed var(--excellent-border-default, #0D5CBD)",
                        },
                        iconStyle: {
                            color: "var(--excellent-icon-default, #1D69CC)",
                        },
                    },
                    hover: {
                        containerStyle: {
                            background: "var(--excellent-bg-medium-hover, #E3EEFF)",
                            border: "1px solid var(--control-border-hover, #3E84E5)",
                        },
                        iconStyle: {
                            color: "var(--excellent-icon-default, #1D69CC)",
                        },
                    },
                    selected: {
                        containerStyle: {
                            background: "var(--excellent-bg-medium-active, #E3EEFF)",
                            border: "3px solid var(--excellent-border-active, #0D5CBD)",
                        },
                        iconStyle: {
                            color: "var(--excellent-icon-active, #1D69CC)",
                        },
                    },
                    "selected-hover": {
                        containerStyle: {
                            background: "var(--excellent-bg-medium-hover, #E3EEFF)",
                            border: "3px solid var(--control-border-hover, #3E84E5)",
                        },
                        iconStyle: {
                            color: "var(--excellent-icon-hover, #1D69CC)",
                        },
                    },
                },
            },
            disabled: {
                iconAsset: statusDisabled,
                iconName: "status-disabled",
                label: "N/A",
                view: {
                    default: {
                        containerStyle: {
                            background: "var(--control-bg-medium-disabled)",
                            border: "0",
                            "pointer-events": "none",
                        },
                        iconStyle: {
                            color: "var(--dormant-icon-default, rgba(111, 118, 128, 1))",
                        },
                    },
                },
                edit: {
                    default: {
                        containerStyle: {
                            background: "var(--control-bg-medium-disabled)",
                            border: "0",
                            "pointer-events": "none",
                        },
                        iconStyle: {
                            color: "var(--dormant-icon-default, rgba(111, 118, 128, 1))",
                        },
                    },
                },
            },
            positive: {
                iconAsset: alertsPositiveSmall,
                iconName: "alerts-positive-small",
                label: "Positive",
                view: {
                    default: {
                        containerStyle: {
                            background: "var(--positive-bg-medium-default, #D9F4FF)",
                            border: "0",
                        },
                        iconStyle: {
                            color: "var(--positive-icon-strong-default, #0D8BD4)",
                        },
                    },
                    hover: {
                        containerStyle: {
                            background: "var(--positive-bg-medium-hover, #D9F4FF)",
                            border: "1px solid var(--control-border-hover, #3E84E5)",
                        },
                        iconStyle: {
                            color: "var(--positive-icon-strong-hover, #0D8BD4)",
                        },
                    },
                    focused: {
                        containerStyle: {
                            background: "var(--positive-bg-medium-hover, #D9F4FF)",
                            border: "1px solid var(--control-border-hover, #3E84E5)",
                            filter: "drop-shadow(0px 0px 4px var(--EffectsFocus-outer, #3E84E5))",
                        },
                        iconStyle: {
                            color: "var(--positive-icon-strong-hover, #0D8BD4)",
                        },
                    },
                },
                edit: {
                    default: {
                        containerStyle: {
                            background: "var(--positive-bg-medium-default, #D9F4FF)",
                            border: "1px dashed var(--positive-border-default, #139BEB)",
                        },
                        iconStyle: {
                            color: "var(--positive-icon-strong-default, #0D8BD4)",
                        },
                    },
                    hover: {
                        containerStyle: {
                            background: "var(--positive-bg-medium-hover, #D9F4FF)",
                            border: "1px solid var(--control-border-hover, #3E84E5)",
                        },
                        iconStyle: {
                            color: "var(--positive-icon-strong-hover, #0D8BD4)",
                        },
                    },
                    selected: {
                        containerStyle: {
                            background: "var(--positive-bg-medium-active, #D9F4FF)",
                            border: "3px solid var(--positive-border-active, #139BEB)",
                        },
                        iconStyle: {
                            color: "var(--positive-icon-strong-active, #0D8BD4)",
                        },
                    },
                    "selected-hover": {
                        containerStyle: {
                            background: "var(--positive-bg-medium-hover, #D9F4FF)",
                            border: "3px solid var(--control-border-hover, #3E84E5)",
                        },
                        iconStyle: {
                            color: "var(--positive-icon-strong-hover, #0D8BD4)",
                        },
                    },
                },
            },
            negative: {
                iconAsset: statusNegative,
                iconName: "status-negative",
                label: "Negative",
                view: {
                    default: {
                        containerStyle: {
                            background: "var(--negative-bg-medium-default, #FFE8E9)",
                            border: "0",
                        },
                        iconStyle: {
                            color: "var(--negative-icon-default, #CC2D37)",
                        },
                    },
                    focused: {
                        containerStyle: {
                            background: "var(--negative-bg-medium-hover, #FFE8E9)",
                            border: "1px solid var(--control-border-hover, #3E84E5)",
                            filter: "drop-shadow(0px 0px 4px var(--EffectsFocus-outer, #3E84E5))",
                        },
                        iconStyle: {
                            color: "var(--negative-icon-default, #CC2D37)",
                        },
                    },
                    hover: {
                        containerStyle: {
                            background: "var(--negative-bg-medium-hover, #FFE8E9)",
                            border: "1px solid var(--control-border-hover, #3E84E5)",
                        },
                        iconStyle: {
                            color: "var(--negative-icon-default, #CC2D37)",
                        },
                    },
                },
                edit: {
                    default: {
                        containerStyle: {
                            background: "var(--negative-bg-medium-default, #FFE8E9)",
                            border: "1px dashed var(--negative-border-default, #CC2D37)",
                        },
                        iconStyle: {
                            color: "var(--negative-icon-default, #CC2D37)",
                        },
                    },
                    hover: {
                        containerStyle: {
                            background: "var(--negative-bg-medium-hover, #FFE8E9)",
                            border: "1px solid var(--control-border-hover, #3E84E5)",
                        },
                        iconStyle: {
                            color: "var(--negative-icon-default, #B2242D)",
                        },
                    },
                    selected: {
                        containerStyle: {
                            background: "var(--negative-bg-medium-active, #FFE8E9)",
                            border: "3px solid var(--negative-border-active, #B2242D)",
                        },
                        iconStyle: {
                            color: "var(--negative-icon-active, #CC2D37)",
                        },
                    },
                    "selected-hover": {
                        containerStyle: {
                            background: "var(--negative-bg-medium-hover, #FFE8E9)",
                            border: "3px solid var(--control-border-hover, #3E84E5)",
                        },
                        iconStyle: {
                            color: "var(--negative-icon-hover, #B2242D)",
                        },
                    },
                },
            },
            "low-warning": {
                iconAsset: statusLowWarning,
                iconName: "status-low-warning",
                label: "Low Warning",
                view: {
                    default: {
                        containerStyle: {
                            background: "var(--low-warning-bg-medium-default, #D5F5F5)",
                            border: "0",
                        },
                        iconStyle: {
                            color: "var(--low-warning-icon-default, #028E99)",
                        },
                    },
                    hover: {
                        containerStyle: {
                            background: "var(--low-warning-bg-medium-default, #D5F5F5)",
                            border: "1px solid var(--control-border-hover, #3E84E5)",
                        },
                        iconStyle: {
                            color: "var(--low-warning-icon-default, #028E99)",
                        },
                    },
                    focused: {
                        containerStyle: {
                            background: "var(--low-warning-bg-medium-default, #D5F5F5)",
                            border: "1px solid var(--control-border-hover, #3E84E5)",
                            filter: "drop-shadow(0px 0px 4px var(--EffectsFocus-outer, #3E84E5))",
                        },
                        iconStyle: {
                            color: "var(--low-warning-icon-default, #028E99)",
                        },
                    },
                },
                edit: {
                    default: {
                        containerStyle: {
                            background: "var(--low-warning-bg-medium-default, #D5F5F5)",
                            border: "1px dashed var(--low-warning-border-default, #028E99)",
                        },
                        iconStyle: {
                            color: "var(--low-warning-icon-default, #028E99)",
                        },
                    },
                    hover: {
                        containerStyle: {
                            background: "var(--low-warning-bg-medium-default, #D5F5F5)",
                            border: "1px solid var(--control-border-hover, #3E84E5)",
                        },
                        iconStyle: {
                            color: "var(--low-warning-icon-default, #028E99)",
                        },
                    },
                    selected: {
                        containerStyle: {
                            background: "var(--low-warning-bg-medium-active, #D5F5F5)",
                            border: "3px solid var(--low-warning-border-active, #028E99)",
                        },
                        iconStyle: {
                            color: "var(--low-warning-icon-active, #028E99)",
                        },
                    },
                    "selected-hover": {
                        containerStyle: {
                            background: "var(--low-warning-bg-medium-default, #D5F5F5)",
                            border: "3px solid var(--control-border-hover, #3E84E5)",
                        },
                        iconStyle: {
                            color: "var(--low-warning-icon-default, #028E99)",
                        },
                    },
                },
            },
            warning: {
                iconAsset: statusWarning,
                iconName: "status-warning",
                label: "Warning",
                view: {
                    default: {
                        containerStyle: {
                            background: "var(--warning-bg-medium-default, #FAEFB9)",
                            border: "0",
                        },
                        iconStyle: {
                            color: "var(--warning-icon-strong-default, #BD7202)",
                        },
                    },
                    hover: {
                        containerStyle: {
                            background: "var(--warning-bg-medium-hover, #FAEFB9)",
                            border: "1px solid var(--control-border-hover, #3E84E5)",
                        },
                        iconStyle: {
                            color: "var(--warning-icon-strong-hover, #BD7202)",
                        },
                    },
                    focused: {
                        containerStyle: {
                            background: "var(--warning-bg-medium-hover, #FAEFB9)",
                            border: "1px solid var(--control-border-hover, #3E84E5)",
                            filter: "drop-shadow(0px 0px 4px var(--EffectsFocus-outer, #3E84E5))",
                        },
                        iconStyle: {
                            color: "var(--warning-icon-strong-hover, #BD7202)",
                        },
                    },
                },
                edit: {
                    default: {
                        containerStyle: {
                            background: "var(--warning-bg-medium-default, #FAEFB9)",
                            border: "1px dashed var(--warning-border-default, #CC8604)",
                        },
                        iconStyle: {
                            color: "var(--warning-icon-strong-default, #BD7202)",
                        },
                    },
                    hover: {
                        containerStyle: {
                            background: "var(--warning-bg-medium-hover, #FAEFB9)",
                            border: "1px solid var(--control-border-hover, #3E84E5)",
                        },
                        iconStyle: {
                            color: "var(--warning-icon-strong-hover, #BD7202)",
                        },
                    },
                    selected: {
                        containerStyle: {
                            background: "var(--warning-bg-medium-active, #FAEFB9)",
                            border: "3px solid var(--warning-border-active, #CC8604)",
                        },
                        iconStyle: {
                            color: "var(--warning-icon-strong-active, #BD7202)",
                        },
                    },
                    "selected-hover": {
                        containerStyle: {
                            background: "var(--warning-bg-medium-hover, #FAEFB9)",
                            border: "3px solid var(--control-border-hover, #3E84E5)",
                        },
                        iconStyle: {
                            color: "var(--warning-icon-strong-hover, #BD7202)",
                        },
                    },
                },
            },
            "severe-warning": {
                iconAsset: statusSevereWarning,
                iconName: "status-severe-warning",
                label: "Severe Warning",
                view: {
                    default: {
                        containerStyle: {
                            background: "var(--severe-warning-bg-medium-default, #FFEADB)",
                            border: "0",
                        },
                        iconStyle: {
                            color: "var(--severe-warning-icon-strong-default, #D95A1A)",
                        },
                    },
                    hover: {
                        containerStyle: {
                            background: "var(--severe-warning-bg-medium-hover, #FFEADB)",
                            border: "1px solid var(--control-border-hover, #3E84E5)",
                        },
                        iconStyle: {
                            color: "var(--severe-warning-icon-strong-default, #D95A1A)",
                        },
                    },
                    focused: {
                        containerStyle: {
                            background: "var(--severe-warning-bg-medium-hover, #FFEADB)",
                            border: "1px solid var(--control-border-hover, #3E84E5)",
                            filter: "drop-shadow(0px 0px 4px var(--EffectsFocus-outer, #3E84E5))",
                        },
                        iconStyle: {
                            color: "var(--severe-warning-icon-strong-default, #D95A1A)",
                        },
                    },
                },
                edit: {
                    default: {
                        containerStyle: {
                            background: "var(--severe-warning-bg-medium-default, #FFEADB)",
                            border: "1px dashed var(--severe-warning-border-default, #CC2D37)",
                        },
                        iconStyle: {
                            color: "var(--severe-warning-icon-strong-default, #D95A1A)",
                        },
                    },
                    hover: {
                        containerStyle: {
                            background: "var(--severe-warning-bg-medium-hover, #FFEADB)",
                            border: "1px solid var(--control-border-hover, #3E84E5)",
                        },
                        iconStyle: {
                            color: "var(--severe-warning-icon-strong-default, #D95A1A)",
                        },
                    },
                    selected: {
                        containerStyle: {
                            background: "var(--severe-warning-bg-medium-active, #FFEADB)",
                            border: "3px solid var(--severe-warning-border-active, #F26722)",
                        },
                        iconStyle: {
                            color: "var(--severe-warning-icon-strong-default, #D95A1A)",
                        },
                    },
                    "selected-hover": {
                        containerStyle: {
                            background: "var(--severe-warning-bg-medium-hover, #FFEADB)",
                            border: "3px solid var(--control-border-hover, #3E84E5)",
                        },
                        iconStyle: {
                            color: "var(--severe-warning-icon-strong-default, #D95A1A)",
                        },
                    },
                },
            },
            dormant: {
                iconAsset: statusDormant,
                iconName: "status-dormant",
                label: "Dormant",
                view: {
                    default: {
                        containerStyle: {
                            background: "var(--dormant-bg-medium-default, #E1E4E8)",
                            border: "0",
                        },
                        iconStyle: {
                            color: "var(--dormant-icon-default, #6F7680)",
                        },
                    },
                    focused: {
                        containerStyle: {
                            background: "var(--dormant-bg-medium-hover, #E1E4E8)",
                            border: "1px solid var(--control-border-hover, #3E84E5)",
                            filter: "drop-shadow(0px 0px 4px var(--EffectsFocus-outer, #3E84E5))",
                        },
                        iconStyle: {
                            color: "var(--dormant-icon-default, #6F7680)",
                        },
                    },
                    hover: {
                        containerStyle: {
                            background: "var(--dormant-bg-medium-hover, #E1E4E8)",
                            border: "1px solid var(--control-border-hover, #3E84E5)",
                            filter: "drop-shadow(0px 0px 4px var(--EffectsFocus-outer, #3E84E5))",
                        },
                        iconStyle: {
                            color: "var(--dormant-icon-default, #6F7680)",
                        },
                    },
                },
                edit: {
                    default: {
                        containerStyle: {
                            background: "var(--dormant-bg-medium-default, #E1E4E8)",
                            border: "1px dashed var(--dormant-border-default, #889099)",
                        },
                        iconStyle: {
                            color: "var(--dormant-icon-default, #6F7680)",
                        },
                    },
                    hover: {
                        containerStyle: {
                            background: "var(--dormant-bg-medium-hover, #E1E4E8)",
                            border: "1px solid var(--control-border-hover, #3E84E5)",
                        },
                        iconStyle: {
                            color: "var(--dormant-icon-default, #6F7680)",
                        },
                    },
                    selected: {
                        containerStyle: {
                            background: "var(--dormant-bg-medium-active, #E1E4E8)",
                            border: "3px solid var(--dormant-border-default, #889099)",
                        },
                        iconStyle: {
                            color: "var(--dormant-icon-active, #6F7680)",
                        },
                    },
                    "selected-hover": {
                        containerStyle: {
                            background: "var(--dormant-bg-medium-hover, #E1E4E8)",
                            border: "3px solid var(--control-border-hover, #3E84E5)",
                        },
                        iconStyle: {
                            color: "var(--dormant-icon-default, #6F7680)",
                        },
                    },
                },
            },
            "in-progress": {
                iconAsset: statusInProgress,
                iconName: "status-in-progress",
                label: "In-progress",
                view: {
                    default: {
                        containerStyle: {
                            background: "var(--in-progress-bg-medium-default, #F3EBFF)",
                            border: "0",
                        },
                        iconStyle: {
                            color: "var(--in-progress-icon-default, #864AE0)",
                        },
                    },
                    hover: {
                        containerStyle: {
                            background: "var(--in-progress-bg-medium-hover, #F3EBFF)",
                            border: "1px solid var(--control-border-hover, #3E84E5)",
                        },
                        iconStyle: {
                            color: "var(--in-progress-icon-default, #864AE0)",
                        },
                    },
                    focused: {
                        containerStyle: {
                            background: "var(--in-progress-bg-medium-hover, #F3EBFF)",
                            border: "1px solid var(--control-border-hover, #3E84E5)",
                            filter: "drop-shadow(0px 0px 4px var(--EffectsFocus-outer, #3E84E5))",
                        },
                        iconStyle: {
                            color: "var(--in-progress-icon-default, #864AE0)",
                        },
                    },
                },
                edit: {
                    default: {
                        containerStyle: {
                            background: "var(--in-progress-bg-medium-default, #F3EBFF)",
                            border: "1px dashed var(--in-progress-border-default, #864AE0)",
                        },
                        iconStyle: {
                            color: "var(--in-progress-icon-default, #864AE0)",
                        },
                    },
                    hover: {
                        containerStyle: {
                            background: "var(--in-progress-bg-medium-hover, #F3EBFF)",
                            border: "1px solid var(--control-border-hover, #3E84E5)",
                        },
                        iconStyle: {
                            color: "var(--in-progress-icon-default, #864AE0)",
                        },
                    },
                    selected: {
                        containerStyle: {
                            background: "var(--in-progress-bg-medium-hover, #F3EBFF)",
                            border: "3px solid var(--in-progress-border-active, #864AE0)",
                        },
                        iconStyle: {
                            color: "var(--in-progress-icon-active, #864AE0)",
                        },
                    },
                    "selected-hover": {
                        containerStyle: {
                            background: "var(--in-progress-bg-medium-hover, #F3EBFF)",
                            border: "3px solid var(--control-border-hover, #3E84E5)",
                        },
                        iconStyle: {
                            color: "var(--in-progress-icon-default, #864AE0)",
                        },
                    },
                },
            },
            custom: {
                iconAsset: customIcon,
                iconName: "custom-icon",
                label: "Custom",
                view: {
                    default: {
                        containerStyle: {
                            background: "var(--accent-j-weak-default, #EBEDFF)",
                            border: "0",
                        },
                        iconStyle: {
                            color: "var(--accent-j-default, #545C8A)",
                        },
                    },
                    hover: {
                        containerStyle: {
                            background: "var(--accent-j-weak-hover, #EBEDFF)",
                            border: "1px solid var(--control-border-hover, #3E84E5)",
                        },
                        iconStyle: {
                            color: "var(--accent-j-hover, #545C8A)",
                        },
                    },
                    focused: {
                        containerStyle: {
                            background: "var(--accent-j-weak-hover, #EBEDFF)",
                            border: "1px solid var(--control-border-hover, #3E84E5)",
                            filter: "drop-shadow(0px 0px 4px var(--EffectsFocus-outer, #3E84E5))",
                        },
                        iconStyle: {
                            color: "var(--accent-j-hover, #545C8A)",
                        },
                    },
                },
                edit: {
                    default: {
                        containerStyle: {
                            background: "var(--accent-j-weak-default, #EBEDFF)",
                            border: "1px dashed var(--accent-j-border-default, #545C8A)",
                        },
                        iconStyle: {
                            color: "var(--accent-j-default, #545C8A)",
                        },
                    },
                    hover: {
                        containerStyle: {
                            background: "var(--accent-j-weak-hover, #EBEDFF)",
                            border: "1px solid var(--control-border-hover, #3E84E5)",
                        },
                        iconStyle: {
                            color: "var(--accent-j-hover, #545C8A)",
                        },
                    },
                    selected: {
                        containerStyle: {
                            background: "var(--accent-j-weak-active, #EBEDFF)",
                            border: "3px solid var(--accent-j-border-active, #545C8A)",
                        },
                        iconStyle: {
                            color: "var(--accent-j-active, #545C8A)",
                        },
                    },
                    "selected-hover": {
                        containerStyle: {
                            background: "var(--accent-j-weak-hover, #EBEDFF)",
                            border: "3px solid var(--control-border-hover, #3E84E5)",
                        },
                        iconStyle: {
                            color: "var(--accent-j-hover, #545C8A)",
                        },
                    },
                },
            },
            info: {
                iconAsset: alertsInfoSmall,
                iconName: "alerts-info-small",
                label: "Info",
                view: {
                    default: {
                        containerStyle: {
                            background: "var(--info-bg-medium-default, #F3EBFF)",
                            border: "0",
                        },
                        iconStyle: {
                            color: "var(--info-icon-default, #864AE0)",
                        },
                    },
                    hover: {
                        containerStyle: {
                            background: "var(--info-bg-medium-hover, #F3EBFF)",
                            border: "1px solid var(--control-border-hover, #3E84E5)",
                        },
                        iconStyle: {
                            color: "var(--info-icon-default, #864AE0)",
                        },
                    },
                    focused: {
                        containerStyle: {
                            background: "var(--info-bg-medium-hover, #F3EBFF)",
                            border: "1px solid var(--control-border-hover, #3E84E5)",
                            filter: "drop-shadow(0px 0px 4px var(--EffectsFocus-outer, #3E84E5))",
                        },
                        iconStyle: {
                            color: "var(--info-icon-default, #864AE0)",
                        },
                    },
                },
                edit: {
                    default: {
                        containerStyle: {
                            background: "var(--info-bg-medium-default, #F3EBFF)",
                            border: "1px dashed var(--info-border-default, #864AE0)",
                        },
                        iconStyle: {
                            color: "var(--info-icon-default, #864AE0)",
                        },
                    },
                    hover: {
                        containerStyle: {
                            background: "var(--info-bg-medium-hover, #F3EBFF)",
                            border: "1px solid var(--control-border-hover, #3E84E5)",
                        },
                        iconStyle: {
                            color: "var(--info-icon-hover, #864AE0)",
                        },
                    },
                    selected: {
                        containerStyle: {
                            background: "var(--info-bg-medium-active, #F3EBFF)",
                            border: "3px solid var(--info-border-active, #864AE0)",
                        },
                        iconStyle: {
                            color: "var(--info-icon-active, #864AE0)",
                        },
                    },
                    "selected-hover": {
                        containerStyle: {
                            background: "var(--info-bg-medium-hover, #F3EBFF)",
                            border: "3px solid var(--control-border-hover, #3E84E5)",
                        },
                        iconStyle: {
                            color: "var(--info-icon-hover, #864AE0)",
                        },
                    },
                },
            },
        },
        axis: {
            left: {
                enabled: true,
                width: LABEL_WIDTH_LEFT_OR_RIGHT,
                axisTemplate: (createElement, data) => {
                    var _a;
                    return createElement("span", {
                        style: {
                            width: `${((_a = userAxisConfig === null || userAxisConfig === void 0 ? void 0 : userAxisConfig.left) === null || _a === void 0 ? void 0 : _a.truncateWidth) || LABEL_TRUNCATE_WIDTH}px`,
                        },
                    }, createElement("hbr-truncate", {
                        onMouseEnter: (event) => {
                            if (event.target.getAttribute("data-truncated") !== null) {
                                showAxisTooltip(event, data);
                            }
                        },
                        onmouseleave: hideAxisTooltip,
                    }, data));
                },
            },
            right: {
                enabled: true,
                width: LABEL_WIDTH_LEFT_OR_RIGHT,
                axisTemplate: (createElement, data) => {
                    var _a;
                    return createElement("span", {
                        style: {
                            width: `${((_a = userAxisConfig === null || userAxisConfig === void 0 ? void 0 : userAxisConfig.right) === null || _a === void 0 ? void 0 : _a.truncateWidth) || LABEL_TRUNCATE_WIDTH}px`,
                        },
                    }, createElement("hbr-truncate", {
                        onMouseEnter: (event) => {
                            if (event.target.getAttribute("data-truncated") !== null) {
                                showAxisTooltip(event, data);
                            }
                        },
                        onmouseleave: hideAxisTooltip,
                    }, data));
                },
            },
            top: {
                enabled: true,
                height: LABEL_HEIGHT_TOP_OR_BOTTOM,
                axisTemplate: (createElement, data) => {
                    var _a;
                    return createElement("span", {
                        style: {
                            width: `${((_a = userAxisConfig === null || userAxisConfig === void 0 ? void 0 : userAxisConfig.top) === null || _a === void 0 ? void 0 : _a.truncateWidth) || LABEL_TRUNCATE_WIDTH}px`,
                        },
                    }, createElement("hbr-truncate", {
                        onMouseEnter: (event) => {
                            if (event.target.getAttribute("data-truncated") !== null) {
                                showAxisTooltip(event, data);
                            }
                        },
                        onmouseleave: hideAxisTooltip,
                    }, data));
                },
            },
            bottom: {
                enabled: true,
                height: LABEL_HEIGHT_TOP_OR_BOTTOM,
                axisTemplate: (createElement, data) => {
                    var _a;
                    return createElement("span", {
                        style: {
                            width: `${((_a = userAxisConfig === null || userAxisConfig === void 0 ? void 0 : userAxisConfig.bottom) === null || _a === void 0 ? void 0 : _a.truncateWidth) || LABEL_TRUNCATE_WIDTH}px`,
                        },
                    }, createElement("hbr-truncate", {
                        onMouseEnter: (event) => {
                            if (event.target.getAttribute("data-truncated") !== null) {
                                showAxisTooltip(event, data);
                            }
                        },
                        onmouseleave: hideAxisTooltip,
                    }, data));
                },
            },
        },
    };
};

const updateLabelContainer = (querySelector, host, paddingTop, paddingLeft) => {
    const target = host.shadowRoot.querySelector(querySelector);
    if (target) {
        target.setAttribute("transform", `translate(${paddingLeft}, ${paddingTop})`);
    }
};
const generateAxis = (data, blockSize, gapSize, labelObj, paddingTop, paddingLeft, position, host) => {
    const positionClass = `axis-${position}`;
    const translateX = position === "left" ? 0 : paddingLeft;
    const translateY = position === "top" ? 0 : paddingTop;
    const labelWidth = position === "left" || position === "right" ? labelObj.width : blockSize;
    const labelHeight = position === "top" || position === "bottom" ? labelObj.height : blockSize;
    // stenciljs does not hydrate svg
    updateLabelContainer(`g.${positionClass}`, host, paddingTop, paddingLeft);
    const { render = (label) => label, axisTemplate } = labelObj;
    return (h("g", { class: positionClass, transform: `translate(${translateX}, ${translateY})` }, data.map((label, index) => {
        const x = position === "left" || position === "right"
            ? 0
            : index * (blockSize + gapSize);
        const y = position === "top" || position === "bottom"
            ? 0
            : index * (blockSize + gapSize);
        return (h("g", { key: `${position}-${label}`, width: labelWidth, height: labelHeight, x: x, y: y, class: "axis-group" },
            h("foreignObject", { "data-label": label }, axisTemplate ? (h("div", { part: positionClass }, axisTemplate(h, label, index))) : (h("div", { part: positionClass, innerHTML: sanitizeHtmlSync(render(label, index)) })))));
    })));
};
const generateAxisTop = (data, blockSize, gapSize, labelTopObj, paddingLeft, host) => generateAxis(data, blockSize, gapSize, labelTopObj, 0, paddingLeft, "top", host);
const generateAxisLegendLeft = (data, blockSize, gapSize, labelLeftObj, paddingTop, host) => generateAxis(data, blockSize, gapSize, labelLeftObj, paddingTop, 0, "left", host);
const generateAxisRight = (data, blockSize, gapSize, labelRightObj, paddingTop, paddingLeft, host) => {
    return generateAxis(data, blockSize, gapSize, labelRightObj, paddingTop, paddingLeft, "right", host);
};
const generateAxisBottom = (data, blockSize, gapSize, labelBottomObj, paddingTop, paddingLeft, host) => generateAxis(data, blockSize, gapSize, labelBottomObj, paddingTop, paddingLeft, "bottom", host);
const setAxisHoveringState = (root, row, col, show) => {
    const axisSelectors = [
        { selector: ".axis-top", label: col },
        { selector: ".axis-left", label: row },
        { selector: ".axis-right", label: row },
        { selector: ".axis-bottom", label: col },
    ];
    axisSelectors.forEach(({ selector, label }) => {
        var _a;
        const axisElement = (_a = root
            .querySelector(selector)) === null || _a === void 0 ? void 0 : _a.querySelector(`[data-label="${label}"]`);
        if (axisElement) {
            show
                ? axisElement.classList.add("--hover")
                : axisElement.classList.remove("--hover");
        }
    });
};
const setDefaultItemTooltipTemplate = (createElement, row, col, obj, fullConfig) => {
    var _a, _b, _c, _d;
    const { iconSrc, view, iconAsset, iconName } = fullConfig.statuses[obj.status] || {};
    if (obj.status) {
        return createElement("div", {
            class: "chart-matrix__popover",
        }, createElement("div", {
            class: "title",
        }, createElement("hbr-tag", { size: "small", accent: view.default.containerStyle.background }, iconAsset
            ? createElement("hbr-icon", {
                slot: "prefix",
                asset: iconAsset,
                style: {
                    color: view.default.iconStyle.color,
                },
            })
            : iconName
                ? createElement("hbr-icon", {
                    slot: "prefix",
                    name: iconName,
                    style: {
                        color: view.default.iconStyle.color,
                    },
                })
                : iconSrc &&
                    createElement("img", {
                        slot: "prefix",
                        src: iconSrc,
                    }), obj.status)), createElement("hbr-divider"), createElement("table", {}, createElement("tr", {}, createElement("td", {}, ((_a = fullConfig === null || fullConfig === void 0 ? void 0 : fullConfig.axis) === null || _a === void 0 ? void 0 : _a.rowLabel) || "Row"), createElement("td", {}, row)), createElement("tr", {}, createElement("td", {}, ((_b = fullConfig === null || fullConfig === void 0 ? void 0 : fullConfig.axis) === null || _b === void 0 ? void 0 : _b.colLabel) || "Column"), createElement("td", {}, col))));
    }
    return createElement("div", {
        class: "chart-matrix__popover",
    }, createElement("table", {}, createElement("tr", {}, createElement("td", {}, ((_c = fullConfig === null || fullConfig === void 0 ? void 0 : fullConfig.axis) === null || _c === void 0 ? void 0 : _c.rowLabel) || "Row"), createElement("td", {}, row)), createElement("tr", {}, createElement("td", {}, ((_d = fullConfig === null || fullConfig === void 0 ? void 0 : fullConfig.axis) === null || _d === void 0 ? void 0 : _d.colLabel) || "Column"), createElement("td", {}, col))));
};
const setDefaultAxisTooltipTemplate = (createElement, data) => {
    return createElement("div", {}, data);
};
const generateDataBlock = (complete2DAry, blockSize, gapSize, iconSize, marginLeft, marginTop, mode, fullConfig, selectedItems) => {
    const { eventListeners: fullConfigEvents, statuses, accessibility, } = fullConfig;
    const eventListeners = [
        "onMouseEnter",
        "onMouseMove",
        "onMouseLeave",
        "onFocus",
        "onBlur",
        "onClick",
    ].reduce((acc, event) => {
        var _a, _b;
        if (mode === "view") {
            acc[event] =
                ((_a = fullConfigEvents === null || fullConfigEvents === void 0 ? void 0 : fullConfigEvents[mode]) === null || _a === void 0 ? void 0 : _a[event]) || (fullConfigEvents === null || fullConfigEvents === void 0 ? void 0 : fullConfigEvents[event]); // @deprecated event without mode
        }
        else {
            acc[event] = (_b = fullConfigEvents === null || fullConfigEvents === void 0 ? void 0 : fullConfigEvents[mode]) === null || _b === void 0 ? void 0 : _b[event];
        }
        return acc;
    }, {});
    let counter = -1;
    return (h("g", { class: "matrix-grid", transform: `translate(${marginLeft},${marginTop})` }, complete2DAry.reduce((acc, row, rowIndex) => {
        const cur = row.data.map((col, colIndex) => {
            var _a, _b, _c;
            const { iconAsset, iconName, iconSrc } = statuses[col.status] || {};
            counter += 1;
            return (h("g", { key: `${row.row}-${col.col}`, width: blockSize, height: blockSize, x: colIndex * (blockSize + gapSize), y: rowIndex * (blockSize + gapSize) },
                h("foreignObject", { class: "grid-cell", "data-row": row.row, "data-col": col.col, "data-status": col.status, "data-index": counter, "data-disabled": col.status === "disabled" ? "true" : "false", "data-selected": mode === "edit" && selectedItems[`${row.row}-${col.col}`]
                        ? "true"
                        : "false" },
                    h("div", { tabIndex: 0, part: "icon-container", 
                        // biome-ignore lint/a11y/useSemanticElements: intentional use of div
                        role: "button", "aria-label": (accessibility === null || accessibility === void 0 ? void 0 : accessibility.ariaLabel)
                            ? accessibility === null || accessibility === void 0 ? void 0 : accessibility.ariaLabel(row, col)
                            : `${row.row} ${col.col}: ${col.status || ""}`, style: applyStylesFromState(mode, statuses, selectedItems, row, col, "containerStyle"), onMouseEnter: eventListeners === null || eventListeners === void 0 ? void 0 : eventListeners.onMouseEnter, onMouseMove: eventListeners === null || eventListeners === void 0 ? void 0 : eventListeners.onMouseMove, onMouseLeave: eventListeners === null || eventListeners === void 0 ? void 0 : eventListeners.onMouseLeave, onFocus: eventListeners === null || eventListeners === void 0 ? void 0 : eventListeners.onFocus, onBlur: eventListeners === null || eventListeners === void 0 ? void 0 : eventListeners.onBlur, onClick: eventListeners === null || eventListeners === void 0 ? void 0 : eventListeners.onClick, onMouseOver: (event) => {
                            setCellStyleFromStateEvent(event, col, statuses, mode, iconSize, true);
                        }, onMouseOut: (event) => {
                            setCellStyleFromStateEvent(event, col, statuses, mode, iconSize, false);
                        } }, iconAsset ? (h("hbr-icon", { asset: (_a = statuses[col.status]) === null || _a === void 0 ? void 0 : _a.iconAsset, size: `${iconSize}px`, style: applyStylesFromState(mode, statuses, selectedItems, row, col, "iconStyle"), part: "icon" })) : iconName ? (h("hbr-icon", { src: (_b = statuses[col.status]) === null || _b === void 0 ? void 0 : _b.iconName, style: applyStylesFromState(mode, statuses, selectedItems, row, col, "iconStyle"), part: "icon" })) : (iconSrc && (h("img", { src: (_c = statuses[col.status]) === null || _c === void 0 ? void 0 : _c.iconSrc, style: applyStylesFromState(mode, statuses, selectedItems, row, col, "iconStyle"), alt: "" })))))));
        });
        acc.push(...cur);
        return acc;
    }, [])));
};
const generateControlPanel = (onZooming, onSelection, mode, config, blockSize, controlRef, setRefCtrl) => {
    var _a;
    const customSystemIcons = (_a = getBootstrapConfig()) === null || _a === void 0 ? void 0 : _a.systemIcons;
    const { statuses, grid } = config;
    const { itemSizes } = grid;
    const infoBlock = Object.entries(statuses).map((pair) => {
        if (pair[1].iconAsset) {
            return (h("div", { class: "chart-matrix__info-block", key: pair[0] },
                h("hbr-icon", { asset: pair[1].iconAsset, style: pair[1].view.default.iconStyle }),
                h("span", null, pair[1].label)));
        }
        if (pair[1].iconName) {
            return (h("div", { class: "chart-matrix__info-block", key: pair[0] },
                h("hbr-icon", { name: pair[1].iconName, style: pair[1].view.default.iconStyle }),
                h("span", null, pair[1].label)));
        }
        if (pair[1].iconSrc) {
            return (h("div", { class: "chart-matrix__info-block", key: pair[0] },
                h("img", { src: pair[1].iconSrc, style: pair[1].view.default.iconStyle, alt: "" }),
                h("span", null, pair[1].label)));
        }
    });
    infoBlock.unshift(h("div", { class: "chart-matrix__info-block", key: "default-block" },
        h("div", { style: {
                background: "var(--base-bg-default, #F7F7F7)",
                width: "14px",
                height: "14px",
                border: "1px dashed var(--control-border-default, #889099)",
                borderRadius: "4px",
            } }),
        h("span", null, "Default")));
    return (h("div", { class: "chart-matrix__control", part: "control", ref: setRefCtrl, onKeyDown: (event) => onCtrlPanelKeyDown(event, controlRef) },
        h("slot", { name: "control-panel" },
            h("hbr-icon-button", { asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons.plus) || plus, disabled: isZoomDisabled(true, itemSizes, blockSize), onClick: () => onZooming(true), style: {
                    backgroundColor: isZoomDisabled(true, itemSizes, blockSize)
                        ? "var(--control-bg-medium-disabled, #E1E4E8)"
                        : "",
                } }),
            h("hbr-divider", { noPadding: true }),
            h("hbr-icon-button", { asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons.minus) || minus, disabled: isZoomDisabled(false, itemSizes, blockSize), onClick: () => onZooming(false), style: {
                    backgroundColor: isZoomDisabled(false, itemSizes, blockSize)
                        ? "var(--control-bg-medium-disabled, #E1E4E8)"
                        : "",
                } }),
            h("hbr-divider", { noPadding: true }),
            h("hbr-icon-button", { asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["check-square"]) || checkSquare, onClick: onSelection, class: mode === "edit" ? "--selected" : "" }),
            h("hbr-divider", { noPadding: true }),
            h("hbr-popover", { placement: "left", hoist: true, trigger: "click hover" },
                h("hbr-icon-button", { asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons.info) || info }),
                h("div", { slot: "content" }, infoBlock)))));
};

const inheritAttributes = (el, attributes = []) => {
    const attributeObject = {};
    attributes.forEach((attr) => {
        if (el.hasAttribute(attr)) {
            const value = el.getAttribute(attr);
            if (value !== null) {
                attributeObject[attr] = el.getAttribute(attr);
            }
            el.removeAttribute(attr);
        }
    });
    return attributeObject;
};
const setForeignObjectAttributes = (chartRef) => {
    Array.from(chartRef.querySelectorAll("foreignObject"))
        .map((e) => {
        return { source: e.parentElement, target: e };
    })
        .forEach(({ source, target }) => {
        const attrs = inheritAttributes(source, ["x", "y", "width", "height"]);
        Object.entries(attrs).forEach(([key, value]) => {
            target.setAttribute(key, value);
        });
    });
    Array.from(chartRef.querySelectorAll(".grid-cell"))
        .map((e) => {
        return { source: e.parentElement, target: e };
    })
        .forEach(({ source, target }) => {
        const attrs = inheritAttributes(source, ["x", "y", "width", "height"]);
        Object.entries(attrs).forEach(([key, value]) => {
            target.setAttribute(key, value);
        });
    });
};
const getRowLabels = (data) => {
    return data.reduce((acc, row) => {
        acc.push(row.row);
        return acc;
    }, []);
};
const getColumnLabels = (data) => {
    return data.reduce((acc, row) => {
        row.data.forEach((col) => {
            if (!acc.includes(col.col)) {
                acc.push(col.col);
            }
        });
        return acc;
    }, []);
};
// change order of the data object too
const fillColIfEmpty = (data, colLabels) => {
    return data.map((row) => {
        return {
            row: row.row,
            data: colLabels.map((col) => {
                return row.data.find((d) => d.col === col) || { col };
            }),
        };
    });
};
const calculateContainerDimensions = (axis, complete2DAry, blockSize, gapSize) => {
    const containerWidth = [axis === null || axis === void 0 ? void 0 : axis.left, axis === null || axis === void 0 ? void 0 : axis.right].reduce((acc, cur) => {
        let width = 0;
        if (cur === null || cur === void 0 ? void 0 : cur.enabled) {
            width = cur.width;
        }
        return width + acc;
    }, 
    // start with column length
    (complete2DAry[0].data.length + 1) * (blockSize + gapSize));
    const containerHeight = [axis === null || axis === void 0 ? void 0 : axis.top, axis === null || axis === void 0 ? void 0 : axis.bottom].reduce((acc, cur) => {
        let height = 0;
        if (cur === null || cur === void 0 ? void 0 : cur.enabled) {
            height = cur.height;
        }
        return height + acc;
    }, 
    // start with row length
    complete2DAry.length * (blockSize + gapSize));
    return { containerWidth, containerHeight };
};
const setTargetCellStyle = (target, gridStyleObject, iconSize) => {
    const { containerStyle = {}, iconStyle = {} } = gridStyleObject || {};
    if (target) {
        if (Object.keys(containerStyle).length !== 0) {
            target.setAttribute("style", "");
            Object.keys(containerStyle).forEach((styleProperty) => {
                target.style[styleProperty] = containerStyle[styleProperty];
            });
        }
        if (target.firstElementChild) {
            if (Object.keys(iconStyle).length !== 0) {
                target.firstElementChild.setAttribute("style", `width: ${iconSize}px;height: ${iconSize}px;`);
                Object.keys(iconStyle).forEach((styleProperty) => {
                    target.firstElementChild.style[styleProperty] =
                        iconStyle[styleProperty];
                });
            }
        }
    }
};
const setCellStyleFromStateEvent = (event, cellObj, allStates, viewMode, iconSize, toggle) => {
    var _a;
    const target = event.target;
    if (((_a = target.parentElement) === null || _a === void 0 ? void 0 : _a.getAttribute("data-selected")) === "true") {
        if (cellObj.status && allStates[cellObj.status]) {
            const allCellStateStyles = allStates[cellObj.status].edit;
            if (toggle && allCellStateStyles["selected-hover"]) {
                setTargetCellStyle(target, allCellStateStyles["selected-hover"], iconSize);
            }
            else {
                setTargetCellStyle(target, allCellStateStyles.selected, iconSize);
            }
        }
        else {
            // default status
            if (toggle) {
                setTargetCellStyle(target, allStates.default.edit["selected-hover"], iconSize);
            }
            else {
                setTargetCellStyle(target, allStates.default.edit.selected, iconSize);
            }
        }
    }
    else {
        if (target && cellObj.status && allStates[cellObj.status]) {
            const allCellStateStyles = allStates[cellObj.status][viewMode];
            if (toggle && allCellStateStyles.hover) {
                setTargetCellStyle(target, allCellStateStyles.hover, iconSize);
            }
            else {
                setTargetCellStyle(target, allCellStateStyles.default, iconSize);
            }
        }
        else {
            // default status
            if (toggle) {
                setTargetCellStyle(target, allStates.default[viewMode].hover, iconSize);
            }
            else {
                setTargetCellStyle(target, allStates.default[viewMode].default, iconSize);
            }
        }
    }
};
const applyStylesFromState = (mode, statuses, selectedItems, row, col, attr) => {
    var _a, _b, _c, _d, _e, _f, _g;
    return mode === "view"
        ? col.status
            ? (_b = (_a = statuses[col.status]) === null || _a === void 0 ? void 0 : _a.view) === null || _b === void 0 ? void 0 : _b.default[attr]
            : (_c = statuses.default.view) === null || _c === void 0 ? void 0 : _c.default[attr]
        : selectedItems[`${row.row}-${col.col}`]
            ? col.status
                ? (_e = (_d = statuses[col.status]) === null || _d === void 0 ? void 0 : _d.edit) === null || _e === void 0 ? void 0 : _e.selected[attr]
                : statuses.default.edit.selected[attr]
            : col.status
                ? (_g = (_f = statuses[col.status]) === null || _f === void 0 ? void 0 : _f.edit) === null || _g === void 0 ? void 0 : _g.default[attr]
                : statuses.default.edit.default[attr];
};
const getNeighborItemInSameSet = (curForeignObj, items, attr, mode = "next") => {
    const itemInSameSet = items.filter((item) => {
        return item.getAttribute(attr) === curForeignObj.getAttribute(attr);
    });
    let curIdx = itemInSameSet.indexOf(curForeignObj);
    if (mode === "next") {
        if (curIdx === itemInSameSet.length - 1) {
            curIdx = -1;
        }
    }
    else {
        if (curIdx === 0) {
            curIdx = itemInSameSet.length;
        }
    }
    return {
        item: itemInSameSet[(curIdx + (mode === "next" ? 1 : -1)) % itemInSameSet.length],
        idx: itemInSameSet[(curIdx + (mode === "next" ? 1 : -1)) % itemInSameSet.length].getAttribute("data-index"),
    };
};
const applyItemStyleFromStatus = (item, status, mode, statuses, iconSize) => {
    var _a, _b, _c;
    const target = item.firstElementChild;
    const itemState = item.getAttribute("data-status") || "default";
    const styleState = ((_b = (_a = statuses[itemState]) === null || _a === void 0 ? void 0 : _a[mode]) === null || _b === void 0 ? void 0 : _b[status]) || ((_c = statuses.default[mode]) === null || _c === void 0 ? void 0 : _c[status]);
    setTargetCellStyle(target, styleState, iconSize);
};
const isZoomDisabled = (isZoomIn, itemSizes, blockSize) => {
    const index = itemSizes.findIndex((size) => size === blockSize);
    return isZoomIn ? index === itemSizes.length - 1 : index === 0;
};
const onCtrlPanelKeyDown = (event, controlRef) => {
    var _a;
    const focusableElements = [
        ...controlRef.querySelectorAll(".chart-matrix__control hbr-button:not([disabled])"),
    ];
    const currentIndex = focusableElements.indexOf(event.target);
    let nextIndex = currentIndex;
    switch (event.key) {
        case "ArrowRight":
            nextIndex = (currentIndex + 1) % focusableElements.length;
            break;
        case "ArrowLeft":
            nextIndex =
                (currentIndex - 1 + focusableElements.length) %
                    focusableElements.length;
            break;
        case "ArrowUp":
            nextIndex =
                (currentIndex - 1 + focusableElements.length) %
                    focusableElements.length;
            break;
        case "ArrowDown":
            nextIndex = (currentIndex + 1) % focusableElements.length;
            break;
        default:
            return;
    }
    (_a = focusableElements[nextIndex]) === null || _a === void 0 ? void 0 : _a.setFocus();
    event.preventDefault();
};
const getAllEnabledCells = (chartRef) => {
    return [...chartRef.querySelectorAll(".grid-cell")].filter((r) => r.getAttribute("data-disabled") !== "true");
};
const updateEventTargetStyle = (context, event) => {
    const target = event.target;
    const foreignObject = target.parentElement;
    const status = foreignObject.getAttribute("data-status") || "default";
    const allStates = context.fullConfig.statuses;
    if (target.getAttribute("data-selected") === "true") {
        if (target && allStates[status]) {
            setTargetCellStyle(target, allStates[status].edit.default, context.gridSize.iconSize);
        }
        else {
            // default status
            setTargetCellStyle(target, allStates.default.edit.default, context.gridSize.iconSize);
        }
    }
    else {
        if (target && allStates[status]) {
            setTargetCellStyle(target, allStates[status].edit["selected-hover"], context.gridSize.iconSize);
        }
        else {
            // default status
            setTargetCellStyle(target, allStates.default.edit["selected-hover"], context.gridSize.iconSize);
        }
    }
};
const getModeEditEventHandlers = (context) => {
    return {
        onClick: (event) => {
            var _a, _b, _c, _d, _e, _f;
            const target = event.target;
            const foreignObject = target.parentElement;
            const row = foreignObject.getAttribute("data-row");
            const col = foreignObject.getAttribute("data-col");
            const status = foreignObject.getAttribute("data-status") || "default";
            updateEventTargetStyle(context, event);
            // deep clone
            const dict = JSON.parse(JSON.stringify(context.selectedItems));
            if (context.selectedItems[`${row}-${col}`]) {
                delete dict[`${row}-${col}`];
                context.selectedItems = dict;
            }
            else {
                dict[`${row}-${col}`] = { status };
                context.selectedItems = dict;
            }
            (_d = (_c = (_b = (_a = context.config) === null || _a === void 0 ? void 0 : _a.eventListeners) === null || _b === void 0 ? void 0 : _b.edit) === null || _c === void 0 ? void 0 : _c.onClick) === null || _d === void 0 ? void 0 : _d.call(_c, event, context.selectedItems);
            // @deprecated
            (_f = (_e = context.config) === null || _e === void 0 ? void 0 : _e.onSelect) === null || _f === void 0 ? void 0 : _f.call(_e, event, context.selectedItems);
        },
        onMouseEnter: (event) => {
            var _a, _b, _c, _d;
            const foreignObject = event.target.parentElement;
            const row = foreignObject.getAttribute("data-row");
            const col = foreignObject.getAttribute("data-col");
            setAxisHoveringState(context.el.shadowRoot, row, col, true);
            (_d = (_c = (_b = (_a = context.config) === null || _a === void 0 ? void 0 : _a.eventListeners) === null || _b === void 0 ? void 0 : _b.edit) === null || _c === void 0 ? void 0 : _c.onMouseEnter) === null || _d === void 0 ? void 0 : _d.call(_c, event);
        },
        onMouseMove: (event) => {
            var _a, _b, _c, _d;
            (_d = (_c = (_b = (_a = context.config) === null || _a === void 0 ? void 0 : _a.eventListeners) === null || _b === void 0 ? void 0 : _b.edit) === null || _c === void 0 ? void 0 : _c.onMouseMove) === null || _d === void 0 ? void 0 : _d.call(_c, event);
        },
        onMouseLeave: (event) => {
            var _a, _b, _c, _d;
            const foreignObject = event.target.parentElement;
            const row = foreignObject.getAttribute("data-row");
            const col = foreignObject.getAttribute("data-col");
            setAxisHoveringState(context.el.shadowRoot, row, col, false);
            (_d = (_c = (_b = (_a = context.config) === null || _a === void 0 ? void 0 : _a.eventListeners) === null || _b === void 0 ? void 0 : _b.edit) === null || _c === void 0 ? void 0 : _c.onMouseLeave) === null || _d === void 0 ? void 0 : _d.call(_c, event);
        },
        onFocus: (event) => {
            var _a, _b, _c, _d;
            (_d = (_c = (_b = (_a = context.config) === null || _a === void 0 ? void 0 : _a.eventListeners) === null || _b === void 0 ? void 0 : _b.edit) === null || _c === void 0 ? void 0 : _c.onFocus) === null || _d === void 0 ? void 0 : _d.call(_c, event);
        },
        onBlur: (event) => {
            var _a, _b, _c, _d;
            (_d = (_c = (_b = (_a = context.config) === null || _a === void 0 ? void 0 : _a.eventListeners) === null || _b === void 0 ? void 0 : _b.edit) === null || _c === void 0 ? void 0 : _c.onBlur) === null || _d === void 0 ? void 0 : _d.call(_c, event);
        },
    };
};
const getModeViewEventHandlers = (context, complete2DAry, hydrationFunction) => {
    return {
        onMouseEnter: (event) => {
            var _a, _b, _c, _d, _e;
            const foreignObject = event.target.parentElement;
            const row = foreignObject.getAttribute("data-row");
            const col = foreignObject.getAttribute("data-col");
            const targetAxisItem = (_a = complete2DAry
                .find((r) => r.row === row)) === null || _a === void 0 ? void 0 : _a.data.find((c) => c.col === col);
            if ((targetAxisItem === null || targetAxisItem === void 0 ? void 0 : targetAxisItem.status) === "disabled") {
                return;
            }
            context.hoveredItems = { row, col, obj: targetAxisItem };
            if (context.fullConfig.tooltipItemTemplate) {
                context.tooltipContent = context.fullConfig.tooltipItemTemplate(hydrationFunction, row, col, targetAxisItem, context.fullConfig);
                context.tooltipRef.open = true;
                context.tooltipRef.anchor = event.target;
            }
            else {
                context.tooltipContent = setDefaultItemTooltipTemplate(hydrationFunction, row, col, targetAxisItem, context.fullConfig);
                context.tooltipRef.open = true;
                context.tooltipRef.anchor = event.target;
            }
            setAxisHoveringState(context.el.shadowRoot, row, col, true);
            (_e = (_d = (_c = (_b = context.config) === null || _b === void 0 ? void 0 : _b.eventListeners) === null || _c === void 0 ? void 0 : _c.view) === null || _d === void 0 ? void 0 : _d.onMouseEnter) === null || _e === void 0 ? void 0 : _e.call(_d, event);
        },
        onMouseMove: (event) => {
            var _a, _b, _c, _d;
            (_d = (_c = (_b = (_a = context.config) === null || _a === void 0 ? void 0 : _a.eventListeners) === null || _b === void 0 ? void 0 : _b.view) === null || _c === void 0 ? void 0 : _c.onMouseMove) === null || _d === void 0 ? void 0 : _d.call(_c, event);
        },
        onMouseLeave: (event) => {
            var _a, _b, _c, _d;
            const foreignObject = event.target.parentElement;
            const row = foreignObject.getAttribute("data-row");
            const col = foreignObject.getAttribute("data-col");
            setAxisHoveringState(context.el.shadowRoot, row, col, false);
            context.tooltipRef.open = false;
            (_d = (_c = (_b = (_a = context.config) === null || _a === void 0 ? void 0 : _a.eventListeners) === null || _b === void 0 ? void 0 : _b.view) === null || _c === void 0 ? void 0 : _c.onMouseLeave) === null || _d === void 0 ? void 0 : _d.call(_c, event);
        },
        onFocus: (event) => {
            var _a, _b, _c, _d;
            (_d = (_c = (_b = (_a = context.config) === null || _a === void 0 ? void 0 : _a.eventListeners) === null || _b === void 0 ? void 0 : _b.view) === null || _c === void 0 ? void 0 : _c.onFocus) === null || _d === void 0 ? void 0 : _d.call(_c, event);
        },
        onBlur: (event) => {
            var _a, _b, _c, _d;
            (_d = (_c = (_b = (_a = context.config) === null || _a === void 0 ? void 0 : _a.eventListeners) === null || _b === void 0 ? void 0 : _b.view) === null || _c === void 0 ? void 0 : _c.onBlur) === null || _d === void 0 ? void 0 : _d.call(_c, event);
        },
        onClick: (event) => {
            var _a, _b, _c, _d;
            (_d = (_c = (_b = (_a = context.config) === null || _a === void 0 ? void 0 : _a.eventListeners) === null || _b === void 0 ? void 0 : _b.view) === null || _c === void 0 ? void 0 : _c.onClick) === null || _d === void 0 ? void 0 : _d.call(_c, event);
        },
    };
};
const getContainerKeyboardEvents = (context) => {
    return {
        onKeyDown: (event) => {
            var _a, _b, _c, _d;
            let data = null;
            const items = Array.from(context.chartRef.querySelectorAll(".grid-cell"));
            if (event.key === "Enter" || event.key === " ") {
                const target = event.target;
                const foreignObject = target.parentElement;
                const row = foreignObject.getAttribute("data-row");
                const col = foreignObject.getAttribute("data-col");
                const status = foreignObject.getAttribute("data-status") || "default";
                updateEventTargetStyle(context, event);
                // deep clone
                data = JSON.parse(JSON.stringify(context.selectedItems));
                if (context.selectedItems[`${row}-${col}`]) {
                    delete data[`${row}-${col}`];
                    context.selectedItems = data;
                }
                else {
                    data[`${row}-${col}`] = { status };
                    context.selectedItems = data;
                }
                event.stopPropagation();
                event.preventDefault();
            }
            else {
                const handleArrowKey = (direction, axis) => {
                    const prev = items[context.keyboardFocusedIndex];
                    if (prev) {
                        applyItemStyleFromStatus(prev, prev.getAttribute("data-selected") === "true"
                            ? "selected"
                            : "default", context.mode, context.fullConfig.statuses, context.gridSize.iconSize);
                        prev.firstElementChild.removeAttribute("tabindex");
                        prev.firstElementChild.blur();
                    }
                    let next = getNeighborItemInSameSet(prev || items[0], items, axis, direction);
                    while (next.item.getAttribute("data-disabled") === "true") {
                        next = getNeighborItemInSameSet(next.item, items, axis, direction);
                    }
                    context.keyboardFocusedIndex = Number.parseInt(next.idx, 10);
                    applyItemStyleFromStatus(next.item, "focused", "view", context.fullConfig.statuses, context.gridSize.iconSize);
                    next.item.firstElementChild.setAttribute("tabindex", "0");
                    next.item.firstElementChild.focus();
                    event.stopPropagation();
                };
                switch (event.key) {
                    case "ArrowRight":
                        handleArrowKey("next", "data-row");
                        break;
                    case "ArrowLeft":
                        handleArrowKey("prev", "data-row");
                        break;
                    case "ArrowDown":
                        handleArrowKey("next", "data-col");
                        break;
                    case "ArrowUp":
                        handleArrowKey("prev", "data-col");
                        break;
                }
            }
            (_d = (_c = (_b = (_a = context.config) === null || _a === void 0 ? void 0 : _a.eventListeners) === null || _b === void 0 ? void 0 : _b[context.mode]) === null || _c === void 0 ? void 0 : _c.onKeyDown) === null || _d === void 0 ? void 0 : _d.call(_c, event, data);
        },
        onKeyUp: (event) => {
            var _a, _b, _c, _d;
            (_d = (_c = (_b = (_a = context.config) === null || _a === void 0 ? void 0 : _a.eventListeners) === null || _b === void 0 ? void 0 : _b[context.mode]) === null || _c === void 0 ? void 0 : _c.onKeyUp) === null || _d === void 0 ? void 0 : _d.call(_c, event, context.selectedItems);
        },
    };
};

export { applyItemStyleFromStatus, calculateContainerDimensions, fillColIfEmpty, generateAxisBottom, generateAxisLegendLeft, generateAxisRight, generateAxisTop, generateControlPanel, generateDataBlock, getAllEnabledCells, getColumnLabels, getContainerKeyboardEvents, getDefaultConfig, getModeEditEventHandlers, getModeViewEventHandlers, getRowLabels, setDefaultAxisTooltipTemplate, setForeignObjectAttributes };

