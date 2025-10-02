import { useState } from "react";

function Home() {
  const [name, setName] = useState("");
  const [city, setCity] = useState("SF");
  const handleTabClick = (event) => {
    console.log("Tab clicked: " + event.target.panel);
  };
  const handleSelect = (event) => {
    setCity(event.target.value);
  };
  const handleInput = (event) => {
    setName(event.target.value);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`Name: ${name}, City: ${city}`);
  };
  return <div className="hbr-css__page-title-container hbr-css__layout-col-2xs">
    <div className="hbr-css__layout-row-sm">
      <div className="hbr-css__text-heading-xl-bold">Get started with Magnetic</div>
    </div>
    <hbr-tab-group primary size="small" onhbr-click={handleTabClick}>
      <hbr-tab slot="nav" panel="form" active>Form</hbr-tab>
      <hbr-tab slot="nav" panel="card">Card</hbr-tab>

      <div style={{ "height": "var(--hbr-spacing-lg)" }}></div>

      <hbr-tab-panel name="form">
        <form onSubmit={handleSubmit} className="hbr-css__layout-col-md">
          <div className="hbr-css__container-card">
            <div className="hbr-css__form-container">
              <div className="hbr-css__form-header">
                <div className=" hbr-css__text-heading-lg-bold">Form title</div>
                <div className="hbr-css__text-secondary-sm">Subtitle</div>
              </div>

              <div className="hbr-css__container-auto">
                <div className="hbr-css__form-section">
                  <hbr-select label="City" value={city} onhbr-change={handleSelect}>
                    <hbr-option value="SF">San Francisco</hbr-option>
                    <hbr-option value="Berlin">Berlin</hbr-option>
                  </hbr-select>

                  <hbr-input value={name} onInput={handleInput} label="Name">
                    <div slot="label-suffix" className="hbr-css__text-secondary-sm">
                      (Optional)
                    </div>
                  </hbr-input>

                  <hbr-switch checked>
                    <div slot="label">
                      <span>Label</span>
                      <hbr-icon name="info" className="hbr-css__text-secondary-sm"></hbr-icon>
                    </div>
                    Toggle
                    <article slot="rear" className="hbr-css__text-secondary-sm">
                      Amet minim mollit non deserunt ullamco est sit aliqua dolor do
                      amet sint. Velit officia consequat duis enim velit mollit.
                      Exercitation veniam consequat.
                    </article>
                  </hbr-switch>
                </div>
              </div>
            </div>
          </div>
          <hbr-button type="submit">Submit</hbr-button>
        </form>
      </hbr-tab-panel>

      <hbr-tab-panel name="card">
        <hbr-card style={{ "--box-shadow": "none" }}>
          <div slot="header" className="hbr-css__layout-col-3xs">
            <div className="hbr-css__layout-row-xs">
              <h3 className="hbr-css__text-heading-md-bold hbr-css__margin-none">
                Title
              </h3>
              <hbr-tag size="small">default</hbr-tag>
            </div>
            <div className="hbr-css__text-secondary-sm">Subtitle</div>
          </div>
          <div className="hbr-css__container-empty" style={{ "width": "388px", "height": "77px" }} />
        </hbr-card>
      </hbr-tab-panel>

    </hbr-tab-group>
  </div>
}

export default Home;