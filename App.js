import React from 'react';
import { FlatList, DrawerLayoutAndroid, Modal, StyleSheet, ToastAndroid, View } from 'react-native';
import {
  Button,
  FormInput,
  FormLabel,
  Header,
  Icon,
  List,
  ListItem,
  Text
} from 'react-native-elements';
import axios from 'axios';

export default class App extends React.Component {
  constructor(props, ctx) {
    super(props, ctx);

    this.editTodo = this.editTodo.bind(this);
    this.getTodos = this.getTodos.bind(this);
    this.handlePressAdd = this.handlePressAdd.bind(this);
    this.handlePressEdit = this.handlePressEdit.bind(this);
    this.handlePressLogin = this.handlePressLogin.bind(this);
    this.handlePressDelete = this.handlePressDelete.bind(this);
    this.handlePressRegister = this.handlePressRegister.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.toggleSwitch = this.toggleSwitch.bind(this);

    this.state = {
      descriptionInput: '',
      modalVisible: false,
      editVisible: false,
      loginVisible: false,
      registerVisible: false,
      username: 'public',
      password: '12345',
      assignedBy: '',
      refreshing: false,
      titleInput: '',
      editId: null,
      mode2: 'login',
      todoItems: [],
      users: [],
      dateTime: null,
      assignedTo: '',
      userID: '',
      filter: 'my'
    };
  }

  componentDidMount() {
    this.getTodos();
  }

  getTodos() {
    const payload = {
      username: this.state.username
    };

    this.setState({ refreshing: true });

    return axios.post("http://192.168.1.9:3009/api/todos/all", payload)
      .then(response => {
        const todos = response.data;
        
        this.setState({
          refreshing: false,
          todoItems: todos.map(function (todo) {
            return {
              id: todo.id,
              title: todo.title,
              description: todo.description,
              dateTime: todo.dateTime,
              assignedTo: todo.assignedTo,
              assignedBy: todo.assignedBy,
              switched: !!todo.done
            };
          })
        });
      })
      .catch(err => {
        this.setState({ refreshing: false });
        ToastAndroid.show(err.toString(), ToastAndroid.SHORT);
      });
  }

  handlePressEdit() {
    axios.put(`http://192.168.1.9:3009/api/todos/${this.state.editId}`, {
      title: this.state.titleInput,
      description: this.state.descriptionInput
    })
      .then(response => {
        ToastAndroid.show(response.data.message, ToastAndroid.SHORT);

        this.setState({
          descriptionInput: '',
          modalVisible: false,
          loginVisible: false,
          titleInput: '',
          editId: null,
          editVisible: false
        }, () => {
          this.getTodos();
        });
      });
  }

  handlePressLogin(){
    const payload = {
      username: this.state.username,
      password: this.state.password,
    };

    return axios.post('http://192.168.1.9:3009/api/users/login', payload)
      .then(response => {
        const users = response.data.userID;
        try{
          this.setState({
            userID: response.data.userID,
            username: response.data.username,
            password: response.data.password,
            loginVisible: false,
            mode2: 'logout'
          })
        }catch(e){ 
          ToastAndroid.show("Invalid Username or Password", ToastAndroid.SHORT);
        }
          ToastAndroid.show("Hello " + (this.state.username), ToastAndroid.SHORT);
      })
      .catch(err => {
        this.setState({ refreshing: false });
        ToastAndroid.show(err.toString(), ToastAndroid.SHORT);
      })
      .then(this.getTodos);
  }

  handlePressRegister(){
    const payload = {
      username: this.state.username,
      password: this.state.password,
    };

    axios.post('http://192.168.1.9:3009/api/users', payload)
      .then(response => {
        ToastAndroid.show(response.data.message, ToastAndroid.SHORT);

        this.setState({
          registerVisible: false,
          modalVisible: false,
          loginVisible: false,
          username: 'public',
          password: '12345',
        })
      })
      .catch(err => ToastAndroid.show(err.response.data.error, ToastAndroid.LONG))
      .then(this.getTodos);
  }

  handlePressAdd() {
    const todoItems = this.state.todoItems.concat();
    const payload = {
      title: this.state.titleInput,
      description: this.state.descriptionInput,
      assignedTo: this.state.assignedTo,
      assignedBy: this.state.username
    };

    axios.post('http://192.168.1.9:3009/api/todos', payload)
      .then(response => {
        ToastAndroid.show(response.data.message, ToastAndroid.SHORT);

        this.setState({
          descriptionInput: '',
          modalVisible: false,
          loginVisible: false,
          titleInput: '',
          assignedTo: '',
          assignedBy: ''
        })
      })
      .catch(err => ToastAndroid.show(err.response.data.error, ToastAndroid.LONG))
      .then(this.getTodos);
  }

  handlePressDelete() {
    axios.delete(`http://192.168.1.9:3009/api/todos/${this.state.editId}`, {
      id: this.state.id
    })
      .then(response => {
        const string = this.state.editId;
        ToastAndroid.show(response.data.message, ToastAndroid.SHORT);

        this.setState({
          descriptionInput: '',
          modalVisible: false,
          editVisible: false,
          titleInput: '',
          editId: null,
        }, () => {
          this.getTodos();
        });
      });
  }

  toggleSwitch(index) {
    const { todoItems } = this.state;
    const todoItem = todoItems[index];


    axios.put(`http://192.168.1.9:3009/api/todos/${todoItem.id}`, {
      title: todoItem.title,
      description: todoItem.description,
      done: !todoItem.switched
    })
      .then(response => {
        ToastAndroid.show(response.data.message, ToastAndroid.SHORT);

        this.setState({
          descriptionInput: '',
          modalVisible: false,
          titleInput: '',
          editId: null,
        }, () => {
          this.getTodos();
        });
      });

    this.setState({
      todoItems: [
        ...todoItems.slice(0, index),
        {
          ...todoItem,
          switched: !todoItem.switched
        },
        ...todoItems.slice(index + 1)
      ]
    });
  }

  editTodo(index) {
    const todo = this.state.todoItems[index];

    this.setState({
      modalVisible: false,
      loginVisible: false,
      registerVisible: false,
      titleInput: todo.title,
      descriptionInput: todo.description,
      editId: todo.id,
      editVisible: true,
    });
  }

  renderRow({ item, index }) {
    return (
      <ListItem
        hideChevron={true}
        onPress={this.editTodo.bind(null, index)}
        onSwitch={this.toggleSwitch.bind(null, index)}
        subtitle={
          <View>
              <Text style={{ fontSize: 13, color: "#a3a3a3" }}>      {item.description}</Text>
              <Text style={{ fontSize: 13, color: "#a3a3a3" }}>      {item.dateTime}</Text>
              <Text style={{ fontSize: 13, color: "#a3a3a3" }}>      Assigned To: {item.assignedTo}</Text>
              <Text style={{ fontSize: 13, color: "#a3a3a3" }}>      Assigned By: {item.assignedBy}</Text>
          </View>
        }
        subtitleStyle={{ color: item.switched ? '#009C6B' : '#a3a3a3' }}
        switched={item.switched}
        switchButton={true}
        title={
          <View>
              <Text style={{ fontSize: 16}}>{item.title}</Text>
          </View>
        }
        titleStyle={{ color: item.switched ? '#009C6B' : '#000000' }}
      />
    );
  }

  render() {
    var navigationView = (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <Text style={{ fontSize: 50 }}> </Text>
        <Text style={{ fontSize: 18 }}>      {this.state.username}</Text>
        <Button onPress={() => this.setState({ filter: 'all', refreshing: true})} title="All Tasks" buttonStyle={{ marginTop: 125 }} backgroundColor="#a3a3a3"/>
        <Button onPress={() => this.setState({ filter: 'my', refreshing: true})} title="My Tasks" buttonStyle={{ marginTop: 5 }} backgroundColor="#a3a3a3"/>
        <Button onPress={() => this.setState({ filter: 'myCompleted', refreshing: true})} title="My Completed Tasks" buttonStyle={{ marginTop: 5 }} backgroundColor="#a3a3a3"/>
        <Button onPress={() => this.setState({ filter: 'others', refreshing: true})}title="Other's Tasks" buttonStyle={{ marginTop: 5 }} backgroundColor="#a3a3a3"/>
        <Button onPress={() => this.setState({ filter: 'othersCompleted', refreshing: true})} title="Completed Other's Tasks" buttonStyle={{ marginTop: 5 }} backgroundColor="#a3a3a3"/>
        <Button onPress={() => this.state.mode2 === 'login' ? this.setState({ loginVisible: true, username: '', password: ''}) : this.setState({ mode2: 'login', username: 'public', password: ''}) } title={this.state.mode2 === 'login' ? 'Log In' : 'Log Out'} buttonStyle={{ marginTop: 150 }} backgroundColor={this.state.mode2 === 'login' ? '#009C6B' : '#f74242'}/>
      </View>
    );
    return (
      <DrawerLayoutAndroid
        drawerWidth={300}
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        renderNavigationView={() => navigationView}>
        <View>
          <Modal
            animationType="slide"
            onRequestClose={() => this.setState({ modalVisible: false })}
            transparent={false}
            visible={this.state.modalVisible}>
            <View>
              <Text style={{ fontSize: 50 }}> </Text>
              <Text h4 style={{ textAlign: 'center' }}>Add To-Do Item</Text>
              <FormLabel>Title</FormLabel>
              <FormInput onChangeText={text => this.setState({ titleInput: text })} value={this.state.titleInput} />
              <FormLabel>Description</FormLabel>
              <FormInput onChangeText={text => this.setState({ descriptionInput: text })} value={this.state.descriptionInput} />
              <FormLabel >Assigned To</FormLabel>
              <FormInput onChangeText={text => this.setState({ assignedTo: text })} value={this.state.assignedTo} />
              <Button onPress={this.handlePressAdd} title='Add'buttonStyle={{ marginBottom: 5 }} backgroundColor="#009C6B"/>
              <Button onPress={() => this.setState({ modalVisible: false, loginVisible: false, registerVisible: false, descriptionInput: '', titleInput: '', editId: '' , dateTime: null, assignedTo: ''})} title="Close" />
            </View>
          </Modal>

          <Modal
            animationType="slide"
            onRequestClose={() => this.setState({ editVisible: false })}
            transparent={false}
            visible={this.state.editVisible}>
            <View>
              <Text style={{ fontSize: 50 }}> </Text>
              <Text h4 style={{ textAlign: 'center' }}>Edit To-Do Item</Text>
              <FormLabel>Title</FormLabel>
              <FormInput onChangeText={text => this.setState({ titleInput: text })} value={this.state.titleInput} />
              <FormLabel>Description</FormLabel>
              <FormInput onChangeText={text => this.setState({ descriptionInput: text })} value={this.state.descriptionInput} />
              <Button onPress={this.handlePressEdit} title='Save' buttonStyle={{ marginBottom: 5 }} backgroundColor="#009C6B"/>
              <Button onPress={this.handlePressDelete} title="Delete" buttonStyle={{ marginBottom: 5}} backgroundColor="#f44242"/> 
              <Button onPress={() => this.setState({ editVisible: false, loginVisible: false, registerVisible: false, modalVisible: false, descriptionInput: '', titleInput: '', editId: '' , dateTime: null, assignedTo: ''})} title="Close" />
            </View>
          </Modal>

          <Modal
            animationType="slide"
            onRequestClose={() => this.setState({ loginVisible: false })}
            transparent={false}
            visible={this.state.loginVisible}>
            <View>
              <Text style={{ fontSize: 50 }}> </Text>
              <Text h4 style={{ textAlign: 'center' }}>Log In</Text>
              <FormLabel>Username</FormLabel>
              <FormInput onChangeText={text => this.setState({ username: text })} value={this.state.username} />
              <FormLabel>Password</FormLabel>
              <FormInput secureTextEntry={true} onChangeText={text => this.setState({ password: text })} value={this.state.password} />
              <Button onPress={this.handlePressLogin} title='Log In' buttonStyle={{ marginBottom: 5 }} backgroundColor="#009C6B"/>
              <Button onPress={() => this.setState({ registerVisible: true, username: '', password: ''}) } title="Sign Up" buttonStyle={{ marginBottom: 5}} backgroundColor="#009C6B"/> 
              <Button onPress={() => this.setState({editVisible: false, loginVisible: false, registerVisible: false, modalVisible: false, username: 'public', password: ''})} title="Close" />
              </View>
          </Modal>

          <Modal
            animationType="slide"
            onRequestClose={() => this.setState({ registerVisible: false })}
            transparent={false}
            visible={this.state.registerVisible}>
            <View>
              <Text style={{ fontSize: 50 }}> </Text>
              <Text h4 style={{ textAlign: 'center' }}>Sign Up</Text>
              <FormLabel>Username</FormLabel>
              <FormInput onChangeText={text => this.setState({ username: text })} value={this.state.username} />
              <FormLabel>Password</FormLabel>
              <FormInput secureTextEntry={true} onChangeText={text => this.setState({ password: text })} value={this.state.password} />
              <Button onPress={this.handlePressRegister} title='Register' buttonStyle={{ marginBottom: 5 }} backgroundColor="#009C6B"/>
              <Button onPress={() => this.setState({editVisible: false, loginVisible: false, registerVisible: false, modalVisible: false, username: 'public', password: ''})} title="Close" />
              </View>
          </Modal>

          <Header
            centerComponent={{ text: 'To-Do List' }}
            rightComponent={{ icon: 'add', onPress: () => this.setState({ modalVisible: true }) }}
          />
          <List containerStyle={{ marginTop: 70 }}>
            <FlatList
              data={this.state.todoItems}
              keyExtractor={item => item.id}
              onRefresh={this.getTodos}
              refreshing={this.state.refreshing}
              renderItem={this.renderRow}
            />
          </List>
      </View>
      </DrawerLayoutAndroid> 
    );
  }
}
