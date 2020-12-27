
import {
  Card, CardImg, CardText, CardBody,
  CardTitle
} from 'reactstrap';
import { baseUrl } from '../shared/baseUrl';

import {
  Breadcrumb, BreadcrumbItem,
  Button, Row, Col, FormFeedback
} from 'reactstrap';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import { Control, LocalForm, Errors } from 'react-redux-form';
import Select from 'react-select';
import { Loading } from './LoadingComponent';

import {
  Navbar, NavbarBrand, Nav, NavbarToggler, Collapse, NavItem, Jumbotron, Modal, ModalHeader, ModalBody,
  Form, FormGroup, Input, Label
} from 'reactstrap';

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => val && (val.length >= len);

const options = [
  { value: 1, label: 1 },
  { value: 2, label: 2 },
  { value: 3, label: 3 },
  { value: 4, label: 4 }
];

class CommentForm extends Component {

  constructor(props) {
    super(props);


    this.toggleNav = this.toggleNav.bind(this);
    this.state = {
      isNavOpen: false,
      isModalOpen: false
    };

    this.toggleNav = this.toggleNav.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }
  toggleNav() {
    this.setState({
      isNavOpen: !this.state.isNavOpen
    });
  }

  toggleModal() {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  }

  handleLogin(event) {
    this.toggleModal();
    alert("Username: " + this.username.value + " Password: " + this.password.value
      + " Remember: " + this.remember.checked);
    event.preventDefault();

  }

  handleSubmit(values) {
    this.toggleModal();
    this.props.postComment(this.props.dishId, values.rating, values.author, values.comment);

  }




  render() {
    return (
      <> <Button outline onClick={this.toggleModal}><span className="fa fa-pencil fa-lg"></span> Submit Comment</Button>

        <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
          <ModalBody>

            <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
              {/* <Row className="form-group">
                <Label htmlFor="rating" md={10}>Rating</Label>
                <Select options={options} className="mt-3 mr-5 col-sm-6" /> 
                </Row> */}
                 <Row className="form-group">
                <Col>
                  <Label htmlFor="rating">Rating</Label>
                  <Control.select model=".rating" id="rating" className="form-control">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </Control.select>
                </Col>
              </Row>

              <Row className="form-group">
                <Label htmlFor="author" md={10}>Your name</Label>

                <Control.text model=".author" id="author" md={10} name="author" 
                  placeholder="Your Name"
                  className="mt-3 ml-3 mr-5 pl-4 col-lg-11"
                  validators={{
                    required, minLength: minLength(3), maxLength: maxLength(15)
                  }}
                />
                <Errors
                  className="text-danger"
                  model=".author"
                  show="touched"
                  messages={{
                    required: 'Required',
                    minLength: 'Must be greater than 3 numbers',
                    maxLength: 'Must be 15 numbers or less',
                    
                  }}
                />

              </Row>


              <Row className="form-group" >
                <Label htmlFor="comment" md={10}>Submit comment</Label>

                <Control.textarea model=".comment" id="comment" name="comment"
                  rows="6"
                  className="form-control mt-3 ml-3 mr-5  pl-4 col-lg-11" />

              </Row>
              <Row className="form-group mt-3 col-md-12" md={10}>
                
                  <Button type="submit" color="primary">
                    Submit
                  </Button>
                
              </Row>
            </LocalForm>

          </ModalBody>
        </Modal>
      </>

    )
  }

}
function RenderComments({ comments,postComment, dishId }) {
  if (comments !== null && comments.length !== 0) {
    const commentsList = comments.map(comment => {
      return (
        <li>
          <p>{comment.comment}</p>
          <p>
            -- {comment.author},
            {new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit"
          }).format(new Date(Date.parse(comment.date)))}
          </p>
        </li>
      );
    });

    return (
      <div>
        <h4>Comments</h4>
        <ul className="list-unstyled">{commentsList}</ul>
        <CommentForm dishId={dishId} postComment={postComment} />
      </div>
    );
  } else {
    return <div />;
  }
}

function RenderDish({ dish }) {
  return (
    <Card>
      <CardImg top src={baseUrl + dish.image} alt={dish.name} />
                
     <CardBody>
        <CardTitle>{dish.name}</CardTitle>
        <CardText>{dish.description}</CardText>
      </CardBody>
    </Card>
  );
}

const DishDetail = props => {
  if (props.isLoading) {
    return(
        <div className="container">
            <div className="row">            
                <Loading />
            </div>
        </div>
    );
}
else if (props.errMess) {
    return(
        <div className="container">
            <div className="row">            
                <h4>{props.errMess}</h4>
            </div>
        </div>
    );
}
else if (props.dish != null) 

  if (props.dish != null) {
    return (
      <div className="container">
        <div className="row">
          <Breadcrumb>
            <BreadcrumbItem>
              <Link to="/menu">Menu</Link>
            </BreadcrumbItem>
            <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
          </Breadcrumb>
          <div className="col-12">
            <h3>{props.dish.name}</h3>
            <hr />
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-md-5 m-1">
            <RenderDish dish={props.dish} />
          </div>
          <div className="col-12 col-md-5 m-1">
            <RenderComments comments={props.comments} 
            postComment={props.postComment}
            dishId={props.dish.id}/>
            
          </div>

        </div>
      </div>
    );
  } else {
    return <div />;
  }
};

export default DishDetail;







//   function renderComments(comments) {
//     if (comments != null)
//       return (
//         <>
//           <h5>Comments</h5>
//           <ul>
//             {comments.map(comment => {
//               return (
//                 <li>
//                   {comment.comment} <br /> -- {comment.author}, {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comment.date)))}
//                 </li>
//               );
//             })}
//           </ul>
//         </>
//       );
//     else return <div></div>;
//   }


// const Dishdetail = ({ dish }) => {
//   if (!dish) {
//     return null;
//   }
//   const { name, image, description, comments } = dish;
//   return (

//     <div className="row">
//       <div className="col-12 col-md-5 m-1">

//         <Card>
//           <CardImg top src={image} alt={name} />
//           <CardBody>
//             <CardTitle>{name}</CardTitle>
//             <CardText>{description}</CardText>
//           </CardBody>
//         </Card>
//       </div>
//       <div className="col-12 col-md-5 m-1">{renderComments(comments)}</div>
//     </div>
//   );
// };

// export default Dishdetail;
