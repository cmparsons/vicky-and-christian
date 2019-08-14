import React from "react";
import {
  Button,
  Container,
  Grid,
  Header,
  Image,
  Segment
} from "semantic-ui-react";
import bedSvg from "../../assets/Bed.svg";
import amazonSvg from "../../assets/amazon.svg";

import "./Home.css";
import CountDown from "../CountDown";
// import DesktopContainer from "./DesktopContainer";
// import MobileContainer from "./MobileContainer";

import cwr from "../../assets/cwr.jpg";
import { Link } from "@reach/router";

export default function Home() {
  return (
    <>
      <div className="hero-image">
        <div className="hero-text">
          <Header as="h1" inverted style={{ fontSize: "3.5em" }}>
            Vicky & Christian{" "}
            <span role="img" aria-hidden="true">
              💒
            </span>
          </Header>
          {/* <h2>11838 Civil War Ave, Carthage, MO 64836</h2> */}
          <h4 style={{ fontSize: 25 }}>
            Saturday, November 16, 2019
            <br />
            3:00 PM
          </h4>
          <CountDown />
          <Button inverted as={Link} to="/rsvp">
            RSVP Here
          </Button>
        </div>
      </div>

      <Segment style={{ padding: "8em 0em" }} vertical>
        <Grid container stackable verticalAlign="middle">
          <Grid.Row>
            <Grid.Column width={8}>
              <Header as="h2" style={{ fontSize: "2em" }}>
                Ceremony and Reception
              </Header>
              <Header as="h3">
                Civil War Ranch
                <br />
                11838 Civil War Ave, Carthage, MO 64836
              </Header>
              <p style={{ fontSize: "1.1em" }}>
                We are excited for you to join us for our big day! The ceremony
                will begin at three o'clock in the afternoon and be held outside
                (weather permitting{" "}
                <span role="img" aria-label="Fingers Crossed" />
                🤞) by the pond. If the weather happens to be against us that
                day, then the ceremony will be held upstairs in the barn or
                under the pavilion. The reception will follow in the barn.
              </p>
            </Grid.Column>
            <Grid.Column floated="right" width={6}>
              <Image
                bordered
                rounded
                size="large"
                alt="Civil War Ranch"
                src={cwr}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column textAlign="center">
              <Button
                size="huge"
                as="a"
                href="https://www.google.com/maps/place/Civil+War+Ranch/@37.22527,-94.3282057,17z/data=!3m1!4b1!4m5!3m4!1s0x87c62a08a5f73041:0xc97b74f233f38d59!8m2!3d37.22527!4d-94.326017"
                target="_blank"
                rel="noopener"
              >
                Get Directions
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>

      <Segment style={{ padding: "8em 0em" }} vertical>
        <Container text>
          <Header as="h3" style={{ fontSize: "2em" }} textAlign="center">
            Registry
          </Header>
          <p style={{ fontSize: "1.33em" }}>
            Your presence is enough of a present to us! But for those of you who
            are stubborn, we've put together a wish-list to help you out.
          </p>
          <Grid style={{ padding: "1em 0em" }}>
            <Grid.Row
              style={{ display: "flex", justifyContent: "space-evenly" }}
            >
              <Image
                src={bedSvg}
                alt="Bed Bath and Beyond Registry"
                width="150"
                height="150"
                as="a"
                href="https://www.bedbathandbeyond.com/store/giftregistry/viewregistryguest/547454763?eventType=Wedding"
                target="_blank"
                rel="noopener"
              />
              <Image
                src={amazonSvg}
                alt="Amazon Registry"
                width="185"
                height="48"
                as="a"
                href="https://www.amazon.com/wedding/christian-parsons-vicky-knight-carthage-november-2019/registry/1K8PVZO7XZFNS"
                target="_blank"
                rel="noopener"
              />
            </Grid.Row>
          </Grid>
        </Container>
      </Segment>

      <Segment style={{ padding: "8em 0em" }} vertical>
        <Container text>
          <Header as="h3" style={{ fontSize: "2em" }} textAlign="center">
            Contact Us
          </Header>
          <p style={{ fontSize: "1.2em" }}>
            If you have any questions or concerns about the wedding, don't be
            afraid to contact us!
          </p>
          <Grid style={{ padding: "1em 0em" }}>
            <Grid.Row columns={2} centered>
              <Grid.Column>
                <Header size="small">Vicky Knight</Header>
                <p>(417) 359 - 6843</p>
              </Grid.Column>
              <Grid.Column>
                <Header size="small">Christian Parsons</Header>
                <p>(417) 793 - 3165</p>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </Segment>
    </>
  );
}

// const ResponsiveContainer = ({ children }) => (
//   <div>
//     <DesktopContainer>{children}</DesktopContainer>
//     <MobileContainer>{children}</MobileContainer>
//   </div>
// );

// const HomepageLayout = () => (
//   <ResponsiveContainer>
//     <Segment style={{ padding: '8em 0em' }} vertical>
//       <Grid container stackable verticalAlign='middle'>
//         <Grid.Row>
//           <Grid.Column width={8}>
//             <Header as='h3' style={{ fontSize: '2em' }}>
//               We Help Companies and Companions
//             </Header>
//             <p style={{ fontSize: '1.33em' }}>
//               We can give your company superpowers to do things that they never thought possible.
//               Let us delight your customers and empower your needs... through pure data analytics.
//             </p>
//             <Header as='h3' style={{ fontSize: '2em' }}>
//               We Make Bananas That Can Dance
//             </Header>
//             <p style={{ fontSize: '1.33em' }}>
//               Yes that's right, you thought it was the stuff of dreams, but even bananas can be
//               bioengineered.
//             </p>
//           </Grid.Column>
//           <Grid.Column floated='right' width={6}>
//             <Image bordered rounded size='large' src='/images/wireframe/white-image.png' />
//           </Grid.Column>
//         </Grid.Row>
//         <Grid.Row>
//           <Grid.Column textAlign='center'>
//             <Button size='huge'>Check Them Out</Button>
//           </Grid.Column>
//         </Grid.Row>
//       </Grid>
//     </Segment>

//     <Segment style={{ padding: '0em' }} vertical>
//       <Grid celled='internally' columns='equal' stackable>
//         <Grid.Row textAlign='center'>
//           <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
//             <Header as='h3' style={{ fontSize: '2em' }}>
//               "What a Company"
//             </Header>
//             <p style={{ fontSize: '1.33em' }}>That is what they all say about us</p>
//           </Grid.Column>
//           <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
//             <Header as='h3' style={{ fontSize: '2em' }}>
//               "I shouldn't have gone with their competitor."
//             </Header>
//             <p style={{ fontSize: '1.33em' }}>
//               <Image avatar src='/images/avatar/large/nan.jpg' />
//               <b>Nan</b> Chief Fun Officer Acme Toys
//             </p>
//           </Grid.Column>
//         </Grid.Row>
//       </Grid>
//     </Segment>

//     <Segment style={{ padding: '8em 0em' }} vertical>
//       <Container text>
//         <Header as='h3' style={{ fontSize: '2em' }}>
//           Breaking The Grid, Grabs Your Attention
//         </Header>
//         <p style={{ fontSize: '1.33em' }}>
//           Instead of focusing on content creation and hard work, we have learned how to master the
//           art of doing nothing by providing massive amounts of whitespace and generic content that
//           can seem massive, monolithic and worth your attention.
//         </p>
//         <Button as='a' size='large'>
//           Read More
//         </Button>

//         <Divider
//           as='h4'
//           className='header'
//           horizontal
//           style={{ margin: '3em 0em', textTransform: 'uppercase' }}
//         >
//           <a href='#'>Case Studies</a>
//         </Divider>

//         <Header as='h3' style={{ fontSize: '2em' }}>
//           Did We Tell You About Our Bananas?
//         </Header>
//         <p style={{ fontSize: '1.33em' }}>
//           Yes I know you probably disregarded the earlier boasts as non-sequitur filler content, but
//           it's really true. It took years of gene splicing and combinatory DNA research, but our
//           bananas can really dance.
//         </p>
//         <Button as='a' size='large'>
//           I'm Still Quite Interested
//         </Button>
//       </Container>
//     </Segment>

//     <Segment inverted vertical style={{ padding: '5em 0em' }}>
//       <Container>
//         <Grid divided inverted stackable>
//           <Grid.Row>
//             <Grid.Column width={3}>
//               <Header inverted as='h4' content='About' />
//               <List link inverted>
//                 <List.Item as='a'>Sitemap</List.Item>
//                 <List.Item as='a'>Contact Us</List.Item>
//                 <List.Item as='a'>Religious Ceremonies</List.Item>
//                 <List.Item as='a'>Gazebo Plans</List.Item>
//               </List>
//             </Grid.Column>
//             <Grid.Column width={3}>
//               <Header inverted as='h4' content='Services' />
//               <List link inverted>
//                 <List.Item as='a'>Banana Pre-Order</List.Item>
//                 <List.Item as='a'>DNA FAQ</List.Item>
//                 <List.Item as='a'>How To Access</List.Item>
//                 <List.Item as='a'>Favorite X-Men</List.Item>
//               </List>
//             </Grid.Column>
//             <Grid.Column width={7}>
//               <Header as='h4' inverted>
//                 Footer Header
//               </Header>
//               <p>
//                 Extra space for a call to action inside the footer that could help re-engage users.
//               </p>
//             </Grid.Column>
//           </Grid.Row>
//         </Grid>
//       </Container>
//     </Segment>
//   </ResponsiveContainer>
// )

// export default HomepageLayout
