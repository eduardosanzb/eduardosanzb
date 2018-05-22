'use strict';
const { h, Color, Text, Component } = require('ink');
const SelectInput = require('ink-select-input');

const figlet = require('figlet');

const clear = require('clear');
const MenuHeader = () => <div>{figlet.textSync('Welcome')}</div>;

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
    process.stdin.on('keypress', this.handleKeyPress);
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
      case 'up': {
        const selected = this.nexSelected(-1);
        this.setState({ selected });
        break;
      }
      case 'down': {
        const selected = this.nexSelected(1);
        this.setState({ selected });
        break;
      }
      case 'space':
      case 'return': {
        this.handleSelect();
        break;
      }
      default:
        break;
    }
  }

  renderItem({ label, color }, index) {
    const bullet =
      index === this.state.selected ? <Color yellow>●</Color> : '○';
    return (
      <div>
        {' '}
        <span />
        {bullet} <Color hex={color}>{label}</Color>
      </div>
    );
  }
  render({ items }) {
    clear();
    return items.map(this.renderItem);
  }
}

const items = [
  { label: 'whoami' },
  { label: 'contact me' },
  { label: 'Mexico!' },
  { label: 'close', color: '#FF0000', action: () => process.exit() },
];
module.exports = () => (
  <div>
    <br />
    <div>
      <MenuHeader />
      <Menu items={items} />
    </div>
    <br />
  </div>
);
