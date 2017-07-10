import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import Auth from '../../components/Auth'
import SearchBarActions from "../../actions/SearchBarActions"
import SearchBarStore from "../../stores/SearchBarStore"

export default class SearchBar extends Component {
    constructor(props) {
        super(props)
        this.state = SearchBarStore.getState()
        this.onChange = this.onChange.bind(this)
    }

    onChange(state) {
        this.setState(state)
    }

    componentDidMount() {
        SearchBarStore.listen(this.onChange)
    }

    componentWillUnmount() {
        SearchBarStore.unlisten(this.onChange)
    }

    handleSubmit(e) {
        e.preventDefault()

        let content = this.state.content
        console.log(content)
        //if (content === '') {
        //    PostAddActions.contentValidationFail()
        //    return
        //}


        SearchBarActions.loadSearchBarForm()
        this.redirectToSearchedUser()
        this.props.history.push("/searchedUser")
    }

    render() {
        if (!Auth.isUserAuthenticated()) {
            return <Redirect to='/user/login'/>
        }

        return (
            <form className="navbar-form" onSubmit={this.handleSubmit.bind(this)}>
                <div className="input-group">
                    <input type="text" className="form-control" value={this.state.content} onChange={SearchBarActions.handleContentChange} name="content"/>
                    <div className="input-group-btn">
                        <input type='submit'  className='btn btn-primary' value="Find"/>
                    </div>
                </div>
            </form>
        )
    }
}