class Breadcrump extends React.Component {
  constructor(props) {
    super(props);
    this.onClickNavigate = this.onClickNavigate.bind(this);
    this.url = 'http://localhost:3000/path/';
    this.state = {
      path: ['root'],
      content: [],
    };
  }
  componentDidMount() {
    const path = this.state.path;
    const pathStr = path.join('/');
    this.getPathContent(pathStr)
      .then((res) => {
        this.setState({
          content: res,
        });
      })
      .catch(console.error);
  }

  getPathContent(path) {
    return fetch(this.url + path).then((res) => res.json());
  }
  onClickNavigate(fullPath) {
    fullPath = fullPath.replace(/\/$/, '');
    this.getPathContent(fullPath)
      .then((res) => {
        this.setState({
          path: fullPath.split('/'),
          content: res,
        });
      })
      .catch(console.err);
  }
  render() {
    const paths = this.state.path;
    let fullPath = '';
    const breadcrumb_path = paths.map((path, i) => {
      fullPath += path + '/';
      return (
        <PathItem
          key={i}
          name={path}
          fullPath={fullPath}
          onClickNavigate={this.onClickNavigate}
        />
      );
    });
    let content_path;
    if (this.state.content.length > 0) {
      content_path = this.state.content.map((entity, i) => {
        let content_path = fullPath;
        content_path += entity.name + '/';
        return (
          <PathItem
            key={i}
            name={entity.name}
            type={entity.type}
            fullPath={content_path}
            onClickNavigate={this.onClickNavigate}
          />
        );
      });
    } else {
      content_path = (
        <PathItem
          key={0}
          name={'This directory is empty'}
          type={'content'}
          onClickNavigate={() => {}}
        />
      );
    }

    return (
      <React.Fragment>
        <ul className='breadcrumb'>{breadcrumb_path}</ul>
        <ul>{content_path}</ul>
      </React.Fragment>
    );
  }
}

class PathItem extends React.Component {
  constructor(props) {
    super(props);
    this.navigate = this.navigate.bind(this);
  }
  navigate(e) {
    if (this.props.type === 'content') {
      return;
    }
    this.props.onClickNavigate(this.props.fullPath);
  }
  render() {
    const name = this.props.name;
    const className = this.props.type === 'content' ? 'file' : 'non-file';
    return (
      <li onClick={this.navigate} className={className}>
        <span>{name}</span>
      </li>
    );
  }
}
ReactDOM.render(<Breadcrump />, document.getElementById('root'));
