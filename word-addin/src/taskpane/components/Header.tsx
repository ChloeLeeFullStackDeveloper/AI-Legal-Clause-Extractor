import * as React from "react";

export interface HeaderProps {
  title: string;
  message?: string;
}

export default class Header extends React.Component<HeaderProps> {
  render() {
    const { title, message } = this.props;

    return (
      <section className="ms-welcome__header">
        <h1 className="ms-fontSize-su ms-fontWeight-light ms-fontColor-white">{title}</h1>
        {message && <p className="ms-fontColor-white">{message}</p>}
      </section>
    );
  }
}