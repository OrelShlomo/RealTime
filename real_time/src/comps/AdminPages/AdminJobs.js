import React from "react";
import "./AdminJobs.css";
import SingleJobItemBusiness from "../BusinessPages/BusinessMyCadidates/SingleJobItemBusiness";
import Candidates from "../BusinessPages/BusinessMyCadidates/Candidates";
import fire from "../../firebaseConfig";
import logo from "../EmployeePages/EmployeeJobOffers/symbol.gif";
import user_pic from "../EmployeePages/EmployeeSettings/person.png";

class AdminJobs extends React.Component {

    state = {
        jobs_list: [],
        candidate_list: [],
        bodyType: "jobs",
        loading: "visible"
    }
    
    componentDidMount() {
        const db = fire.database();
        db.ref("/jobs/jobs_list").on("value", snapshot => {
          let allJobs = [];
          snapshot.forEach(snap => {
            if(snap.val().is_my_job !== true)
              allJobs.push(snap.val());
          });
          this.setState({ jobs_list: allJobs, loading: "hidden" });
        });
    }
    
    setBodyTypeState=()=>{
        if(this.state.bodyType==="jobs"){
          this.setState({
            bodyType: "candidates"
          });
          const db = fire.database();
          db.ref("/employees/employees_list").on("value", snapshot => {
            let allcandidates = [];
            snapshot.forEach(snap => {
              allcandidates.push(snap.val());
            });
            this.setState({ candidate_list: allcandidates, loading: "hidden" });
          });
        }
        else{
          this.setState({
            bodyType: "jobs"
          });
        }
    }
    
      render() {
        if (this.state.bodyType=== "jobs"){
        return (
          <div id="jobs_admin">
            <div id="jobs_admin_title">
                שלום עמית
            </div>
            <div id="jobs_admin_loading_jobs_container" style={{ visibility: `${this.state.loading}`, }}>
              טוען...<br />
              <div id="jobs_admin_loading_jobs" className="spinner-border" role="status" style={{}}>
                <span className="sr-only">Loading...</span>
              </div>
            </div>
            <ul>
              {
                this.state.jobs_list.map((job, index) => {
                  return <SingleJobItemBusiness type={job.type}
                    hours={job.hours}
                    date={job.date}
                    place={job.place}
                    salary={job.salary}
                    long_info={job.long_info}
                    logo={logo}
                    remarks={job.remarks}
                    clothing={job.clothing}
                    payment_time={job.payment_time}
                    setBodyTypeState={this.setBodyTypeState}
                   />
                })
              }
            </ul>
          </div>
        );
        }
        else{
          return (
              <div id="jobs_admin">
                <div id="jobs_admin_loading_jobs_container" style={{ visibility: `${this.state.loading}`, }}>
                    טוען...<br />
                  <div id="jobs_admin_loading_jobs" className="spinner-border" role="status" style={{}}>
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
                  <div id="return_jobs_admin" onClick={this.setBodyTypeState}>חזור</div>
                <ul>
                  {
                    this.state.candidate_list.map((candidate, index) => {
                      return <Candidates first_name={candidate.first_name}
                      last_name={candidate.last_name}
                      email={candidate.email}
                      phone_number={candidate.phone_number}
                      address={candidate.address}
                      birth_date={candidate.birth_date}
                      user_pic={user_pic}
                      favorite_jobs={candidate.favorite_jobs}
                      about_me={candidate.about_me}
                      setBodyTypeState={this.setBodyTypeState}
                      />
                    })
                  }
                </ul>
              </div>
          );
        }
      }
};
export default AdminJobs;