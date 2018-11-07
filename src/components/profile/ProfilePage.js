import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";

import fireStorage from "../../firebase";

import coverPhoto from '../../static/img/retro-hop.jpg';
// import spinner from '../../static/img/index.svg';
// import avtar from '../../static/img/avtar.jpg'
import PageSuggestions from "../common/PageSuggestions";
import { updateUserProfile } from '../../actions/authActions';
import { loading, loaded } from './../../actions/authActions';

class ProfilePage extends Component {

  updateProfile(event) {
    let user = {};
    if(this.refs.new_first_name.value) {
      user.first_name = this.refs.new_first_name.value;
    }
    if(this.refs.new_last_name.value) {
      user.last_name = this.refs.new_last_name.value;
    }
    if(this.refs.new_email.value) {
      user.email = this.refs.new_email.value;
    }
    if(this.refs.new_bio.value) {
      user.bio = this.refs.new_bio.value;
    }
    const updatedUser = {
      user: user
    }
    this.props.updateUserProfile(updatedUser, this.props.history);
    event.preventDefault();
  }

  uploadCoverPic(event) {
    console.log(event.target.files[0]);
    const image = event.target.files[0];
    // console.log(image.name);
    let uploadTask = fireStorage.ref(`covers/${image.name}`).put(image);
    uploadTask.on('state_changed',
      (snapshot) => {
        this.props.loading();
        console.log("uploading");
      },
      (error) => {
        this.props.loaded();
        console.log(error);
      },
      () => {
        fireStorage.ref('covers').child(image.name).getDownloadURL().then(
          url => {
            console.log(url);
            const updatedUser = {
              user : {
                cover: url
              }
            };
            this.props.updateUserProfile(updatedUser, this.props.history);
          }
        );
      }
    )
    event.preventDefault();
  }

  uploadProfilePic(event) {
    console.log(event.target.files[0]);
    const image = event.target.files[0];
    // console.log(image.name);
    let uploadTask = fireStorage.ref(`dp/${image.name}`).put(image);
    uploadTask.on('state_changed',
      (snapshot) => {
        console.log("uploading");
        this.props.loading();
      },
      (error) => {
        console.log(error);
        this.props.loaded();
      },
      () => {
        fireStorage.ref('dp').child(image.name).getDownloadURL().then(
          url => {
            console.log(url)
            const updatedUser = {
              user : {
                image: url
              }
            };
            this.props.updateUserProfile(updatedUser, this.props.history);
          }
        );
      }
    )
    event.preventDefault();
  }

  updateProfilePic() {
    document.getElementById("dp").click();
  }

  updateCoverPic() {
    document.getElementById("cover").click();
  }

  render() {

    return (
      <div>
        <div className="uk-container uk-padding-small" data-uk-scrollspy="cls: uk-animation-slide-bottom-medium; target: > div; delay: 40;">

          <div className="uk-margin-medium-bottom">
            <div className="uk-height-medium uk-background-cover uk-light uk-flex" data-uk-parallax="bgy: -200"
            style={{
              backgroundImage: `url(${
                this.props.auth.userProfile.cover === "https://thumb.ibb.co/eN5O0f/temp.jpg" ? coverPhoto : this.props.auth.userProfile.cover
              })`}}>

              <div className="uk-overlay uk-overlay-primary uk-position-bottom uk-padding-remove">
                <div className="uk-grid-small uk-flex-inline" uk-grid="true">

                  <div className="uk-width-auto">
                    <div className="uk-inline-clip uk-transition-toggle" tabIndex="0">
                      <img className="uk-transition-scale-down ov-curser-pointer uk-transition-opaque" width="150px" src={this.props.auth.userProfile.image} onClick={(e) => this.updateProfilePic(e)} alt="" data-uk-tooltip="title: Upload new Profile Picture; pos: bottom-center"/>
                      <div className="uk-position-center">
                        <form style={{ display: 'none' }} onSubmit={this.uploadProfilePic.bind(this)}>
                          <input id="dp" name="dp" type="file" ref="dp" onChange={(e) => this.uploadProfilePic(e)}/>
                        </form>
                        {
                          !this.props.auth.loading ?
                          (
                            <span className="uk-transition-slide-bottom-small ov-curser-pointer" onClick={(e) => this.updateProfilePic(e)} uk-icon="icon: cloud-upload; ratio: 3"></span>
                          ): <div className="uk-text-right uk-animation-scale-up" data-uk-spinner="ratio: 1.5"></div>
                        }
                      </div>
                    </div>
                  </div>

                  <div className="uk-width-expand uk-align-center">
                    <div className="uk-width-1-1" data-uk-grid="true">
                      <div className="uk-width-auto">
                        <h3 className="uk-card-title uk-margin-remove-bottom">
                          {this.props.auth.user.first_name ? this.props.auth.user.first_name: "Name"}
                          &nbsp;
                          {this.props.auth.user.last_name ? this.props.auth.user.last_name: "Last"}
                        </h3>
                        <h5 className="uk-margin-remove-top">{this.props.auth.user.bio ? this.props.auth.user.bio: "dattebayo! ✌"}</h5>
                      </div>
                      <div className="uk-width-expand">
                        <button className="uk-icon-button uk-button-default uk-margin-small-bottom" data-uk-toggle="target: #ov-profile-modal" data-uk-icon="pencil" data-uk-tooltip="title: Edit profile; pos: right"></button>

                        <div id="ov-profile-modal" data-uk-modal="true">
                          <div className="uk-modal-dialog uk-modal-body uk-overflow-auto">
                            <form onSubmit={this.updateProfile.bind(this)}>
                              <fieldset className="uk-fieldset">

                                <legend className="uk-legend">Update  Profile</legend>
                                <div className="uk-margin">
                                  <p>First Name <span className="uk-margin-small-right uk-align-right" data-uk-icon="info" data-uk-tooltip="pos: top; title: Full name if page"></span></p>
                                  <input className="uk-input" ref="new_first_name" placeholder={this.props.auth.user.first_name ? this.props.auth.user.first_name: "First Name"} type="text"/>
                                </div>

                                <div className="uk-margin">
                                  <p>Last Name <span className="uk-margin-small-right uk-align-right" data-uk-icon="info" data-uk-tooltip="pos: top; title: Leave blank if page"></span></p>
                                  <input className="uk-input" ref="new_last_name" placeholder={this.props.auth.user.last_name ? this.props.auth.user.last_name: "Last Name"} type="text"/>
                                </div>

                                <div className="uk-margin">
                                  <p>E-mail <span className="uk-margin-small-right uk-align-right" data-uk-icon="info" data-uk-tooltip="pos: top; title: Email"></span></p>
                                  <input className="uk-input" ref="new_email" placeholder={this.props.auth.user.email ? this.props.auth.user.email: ""} type="E-mail"/>
                                </div>

                                <div className="uk-margin">
                                  <p>Bio</p>
                                  <textarea className="uk-textarea" ref="new_bio" placeholder={this.props.auth.user.bio ? this.props.auth.user.bio: "Bio"} rows="5"></textarea>
                                </div>

                              </fieldset>

                              <div className="uk-flex-inline uk-width-1-1">
                                <p className="uk-text-right uk-align-left">
                                  <button className="uk-button uk-button-secondary uk-modal-close" type="button">Cancel</button>
                                  <button className="uk-button uk-button-primary" onSubmit={(e) => this.updateProfile(e)} type="submit">Update</button>
                                </p>
                                {
                                  this.props.auth.loading ? (
                                    <div className="uk-text-right uk-animation-scale-up" data-uk-spinner="ratio: 1.5"></div>
                                  ) : (<span className="uk-margin-small-right uk-animation-scale-down uk-text-success" data-uk-icon="icon: check; ratio: 2" data-uk-tooltip="pos: top; title: all done 👌"></span>)
                                }
                              </div>
                            </form>

                          </div>
                        </div>

                        <form style={{ display: 'none' }} onSubmit={this.uploadCoverPic.bind(this)}>
                          <input id="cover" name="cover" type="file" ref="cover" onChange={(e) => this.uploadCoverPic(e)}/>
                        </form>

                        <button className="uk-icon-button uk-button-default" onClick={(e) => this.updateCoverPic(e)} data-uk-icon="cloud-upload" data-uk-tooltip="title: Upload cover photo; pos: right"></button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>

          <div className="uk-text-center" data-uk-grid="true">
            <div className="uk-width-expand@m">
              <div className="uk-card uk-card-default uk-padding-remove uk-card-body">

                  <ul className="uk-flex-center uk-subnav uk-subnav-pill" data-uk-switcher="animation: uk-animation-slide-top-small, uk-animation-slide-top-small; duration: 200;">
                    <li className="uk-active"><Link to="#">Following</Link></li>
                    <li><Link to="#">Followers</Link></li>
                  </ul>
                  <ul className="uk-switcher uk-margin">
                    <div>
                      <li className="uk-padding-small uk-box-shadow-hover-small">
                        <Link to={"/user/admin2"}>
                          <div className="uk-grid-small uk-flex-inline uk-width-1-1 uk-margin-remove-top" uk-grid="true">
                            <div className="uk-width-1-5">
                              <img className="uk-border-circle" width="40" height="40" alt="me" src="https://avatars0.githubusercontent.com/u/25580776?s=400&u=9369191f891fcda2a8269e44421ea2357aa0f33d&v=4"/>
                            </div>
                            <div className="uk-width-4-5 uk-text-left">
                              <h6 className="uk-margin-remove-bottom">Encore</h6>
                              <p className="uk-text-meta uk-margin-remove-top">Music Club</p>
                            </div>
                          </div>
                        </Link>
                      </li>
                      <li className="uk-padding-small uk-box-shadow-hover-small">
                        <Link to="#">
                          <div className="uk-grid-small uk-flex-inline uk-width-1-1 uk-margin-remove-top" uk-grid="true">
                            <div className="uk-width-1-5">
                              <img className="uk-border-circle" width="40" height="40" alt="me" src="https://avatars0.githubusercontent.com/u/25580776?s=400&u=9369191f891fcda2a8269e44421ea2357aa0f33d&v=4"/>
                            </div>
                            <div className="uk-width-4-5 uk-text-left">
                              <h6 className="uk-margin-remove-bottom">Encore</h6>
                              <p className="uk-text-meta uk-margin-remove-top">Music Club</p>
                            </div>
                          </div>
                        </Link>
                      </li>
                      <hr/>
                      <Link className="uk-button uk-margin-bottom-small" to={"/user/" + this.props.auth.user.username + "/followers"}>Show all following</Link>
                    </div>
                    <div>
                      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </div>
                  </ul>
              </div>

            </div>
            <div className="uk-width-1-3@m">
              <PageSuggestions/>
            </div>
          </div>

          <div className="uk-text-center" data-uk-grid="true">
            <div className="uk-width-expand@m">
              <div className="uk-card uk-card-default uk-card-body">Expand</div>
            </div>
            <div className="uk-width-1-3@m">
              <div className="uk-card uk-card-default uk-card-body">1-3</div>
            </div>
          </div>

          <div className="uk-text-center" data-uk-grid="true">
            <div className="uk-width-2-3@m uk-align-center">
              <div className="uk-card uk-card-default uk-card-body">2-3</div>
            </div>
          </div>

        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { updateUserProfile, loading, loaded })(withRouter(ProfilePage));