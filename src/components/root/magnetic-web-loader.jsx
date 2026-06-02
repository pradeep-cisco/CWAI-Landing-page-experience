import { bootstrap, loadThemeStylesheets } from "@harbor/elements";

document.body.setAttribute("data-theme", "onecd");
loadThemeStylesheets();

bootstrap({
	base: `${import.meta.env.BASE_URL}harbor-elements/`,
	iconAssetPath: "/harbor-elements/icons/magnetic/svg/",
	nonce: "r4nd0m",
	injectScript: true,
	injectStyle: true,
	injectTokens: true,
	injectDarkTokens: true,
	injectMagneticTheme: true,
	injectMagneticDarkTheme: true,
	injectMagneticClassicTheme: true,
	injectOneCDTokens: true,
	injectOneCDDarkTokens: true,
	injectOneCDTheme: true,
	injectOneCDDarkTheme: true,
	/**
   * Uncomment to get blue brand theme
   */
	// injectMagneticBrandAltTheme: true,
});
