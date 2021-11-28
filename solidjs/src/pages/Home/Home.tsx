import styles from "./Home.module.css";
export default () => {
  return (
    <div>
      <p>Hello and welcome,</p>
      <p>
        I go by the nicknames of <i>Ucat</i> and <i>Fon</i> and i've been
        building this tool on my spare time. You can contact me using discord,
        my handle is Fon#2880. Here's a brief explanation on current features:
      </p>
      <p>
        <b>Price calculator</b> page is where you can find all recipes in game
        and use them to figure out how much you should price your products in
        your store. No more excel or calculator, this tool does all those
        calculations for you.
      </p>
      <p>
        <b>Ingame market</b> page is where you can check the products that are
        being sold at this moment in ingame stores. There are currently two
        views with different visibility level: one for stores and one for
        products.
      </p>
      <p>
        <b>Raw data</b> page is where you can download the raw files i use on
        this tool to check raw data or to create your own tool.
      </p>
      <br />
      <p>
        This is very much a work in progress and more sections should be added
        in the future.
      </p>
      <p>So stay tuned, and i hope you enjoy it</p>
      <br />
      <br />
      <p>
        PS: I could really use the help of a UX designer to improve this tool.
        If you have the skills and are willing to help, please reach out to me
        over discord.{" "}
      </p>
      <br />
      <br />
      <div class={styles.changelog}>
        <h2>Latest changes</h2>
        <h3>2.2.0 (2021-11-28)</h3>
        <h4>Features</h4>
        <ul>
          <li>Improvement on price calculator: recipe tree navigation</li>
        </ul>
        <h3>2.1.0 (2021-11-23)</h3>
        <h4>Features</h4>
        <ul>
          <li>Added Price calculator page</li>
        </ul>
        <h3>2.0.0 (2021-11-21)</h3>
        <h4>Features</h4>
        <ul>
          <li>Added Ingame Market page</li>
          <li>Added Raw data page</li>
        </ul>
      </div>
    </div>
  );
};
