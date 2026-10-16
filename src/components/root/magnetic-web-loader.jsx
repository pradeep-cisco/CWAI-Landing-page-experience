import { bootstrap, loadThemeStylesheets } from "@harbor/elements";

document.body.setAttribute("data-theme", "onecd");

bootstrap({
	base: `${import.meta.env.BASE_URL}harbor-elements/`,
	iconAssetPath: "/harbor-elements/icons/magnetic/svg/",
	nonce: "r4nd0m",
	injectScript: true,
	injectStyle: true,
	injectBaseTokens: true,
	injectBaseMagneticTheme: true,
	injectOneCDTheme: true,
	injectOneCDDarkTheme: true,
});

loadThemeStylesheets();
