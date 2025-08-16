"use strict";

const path = require("path");
const opn = require("opn");
const figlet = require("figlet");
const terminalImage = require("terminal-image");
const { h, Color, Text, Component } = require("ink");
const SelectInput = require("ink-select-input");

const MenuHeader = () => (
  <div>
    <div>{figlet.textSync("Welcome")}</div>
    You can use vim keybindings
  </div>
);

const LIST_ITEMS = [
  {
    label: "whoami",
    action: () => opn("http://eduardosanzb.github.io/", { wait: false }),
  },
  {
    label: "contact me",
    action: () => opn("mailto:eduardosanzb@gmail.com?Subject=Hello World 🇲🇽"),
  },
  {
    label: "download cv",
    action: () =>
      opn(
        "https://raw.githubusercontent.com/eduardosanzb/eduardosanzb/master/cv.pdf",
      ),
  },
  {
    label: "Mexico!",
    action: async () => {
      console.log(await terminalImage.file(path.join(__dirname, "mexico.jpg")));
    },
  },
  { label: "close", color: "#FF0000", action: () => process.exit() },
];
class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 0,
    };
    this.renderItem = this.renderItem.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }
  componentDidMount() {
    process.stdin.on("keypress", this.handleKeyPress);
  }
  nexSelected(direction) {
    const { selected } = this.state;
    const { length } = this.props.items;
    return (selected + direction + length) % length;
  }
  handleSelect() {
    const action = this.props.items[this.state.selected].action;
    action && action();
  }
  handleKeyPress(ch, key) {
    const { items } = this.props;
    switch (key.name) {
      case "k":
      case "up": {
        const selected = this.nexSelected(-1);
        this.setState({ selected });
        break;
      }
      case "j":
      case "down": {
        const selected = this.nexSelected(1);
        this.setState({ selected });
        break;
      }
      case "space":
      case "o":
      case "return": {
        this.handleSelect();
        break;
      }
      default:
        break;
    }
  }
  renderItem({ label, color, action }, index) {
    const bullet =
      index === this.state.selected ? <Color yellow>●</Color> : "○";
    return (
      <div>
        {" "}
        <span />
        {bullet} <Color hex={color}>{label}</Color>
      </div>
    );
  }
  render({ items }) {
    return items.map(this.renderItem);
  }
}
module.exports = () => (
  <div>
    <br />
    <div>
      <MenuHeader />
      <Menu items={LIST_ITEMS} />
    </div>
    <br />
  </div>
);
