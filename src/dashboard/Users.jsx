import React, { Component } from 'react';
import axios from 'axios';
import { Row, Button, Col } from 'reactstrap';

class Users extends Component {

  constructor(props) {
    super(props);

    this.url = 'http://localhost:3000/users/';
  }

  state = {
    users: [],
    editingUsers: {},
    tempUser: {}
  }

  componentDidMount() {
    // Ofc, you should use the local not this link
    axios.get(this.url)
      .then(res => {
        this.setState({
          users: res.data
        })

        // Now the state will be updated with the data received from response
      })
  }

  edit = user => {
    this.setState({
      editingUsers: {...this.state.editingUsers, [user.id]: {...user}}
    });
  }

  bindInputToState = (e, id) => {
    this.setState({
      editingUsers: {
        ...this.state.editingUsers,
        [id]: {
          ...this.state.editingUsers[id],
          [e.target.name]: e.target.value
        }
      }
    })
  }

  save = id => {
    axios.put(this.url + id, this.state.editingUsers[id])
      .then(res => {
        this.setState({
          users: this.state.users.map(user => {
            if (user.id === id) {
              return res.data;
            }
            return user;
          }),
          editingUsers: {...this.state.editingUsers, [id]: false}
        })
      })
  }

  cancel = id => {
    this.setState({
      editingUsers: {...this.state.editingUsers, [id]: false}
    });
  }

  delete = user => {
    axios.delete(this.url + user.id)
      .then(res => {
        this.setState({
          users: this.state.users.filter(x => x.id !== user.id)
        })
      })
  }

  render() {
    return (
      <Row>
        <Col md={12}>
          <input type="text"
            onChange={e => this.setState({ tempUser: { ...this.state.tempUser, name: e.target.value } })}
            value={this.state.tempUser.name} />
        </Col>
        <Col md={12}>
          <table className="table">
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.users.map((user, i) => (
                  <tr key={i}>
                    <td>
                      {user.id}
                    </td>
                    <td>
                      {
                        this.state.editingUsers[user.id]
                          ? <input type="text" value={this.state.editingUsers[user.id].name}
                            name="name"
                            onChange={e => this.bindInputToState(e, user.id)}
                            className="form-control" />
                          : user.name
                      }
                    </td>
                    <td>
                      {
                        this.state.editingUsers[user.id]
                          ? <input type="email"
                            value={this.state.editingUsers[user.id].email}
                            onChange={e => this.bindInputToState(e, user.id)}
                            className="form-control" name="email" />
                          : user.email
                      }
                    </td>
                    <td>
                      <div className="btn-group">
                        {
                          this.state.editingUsers[user.id]
                            ? (
                                <React.Fragment>
                                  <Button color="primary" 
                                    onClick={() => this.save(user.id)}>Save</Button>
                                  <Button color="outline-warning" 
                                    onClick={() => this.cancel(user.id)}>Cancel</Button>
                                </React.Fragment>
                              )
                            : <Button color="warning" onClick={() => this.edit(user)}>
                              Edit
                              </Button>
                        }
                        <Button color="danger" onClick={() => this.delete(user)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </Col>
      </Row>
    );
  }
}

export default Users;
