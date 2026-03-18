import { bootstrap } from "@harbor/elements";
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
  /**
   * Uncomment to get blue brand theme
   */
	// injectMagneticBrandAltTheme: true,
  /**
   * Uncomment to get OneCD theme
   */
	// injectOneCDTokens: true,
	// injectOneCDDarkTokens: true,
	// injectOneCDTheme: true,
	// injectOneCDDarkTheme: true
});