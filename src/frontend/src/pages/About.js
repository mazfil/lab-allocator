import { Component } from 'react';

export default class About extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <header>
                    <h1>About SoCo - Resource Maximisation Planning System for Labs</h1>
                </header>

                <section>
                    <h2>Our Mission</h2>
                    <p>
                        At SoCo, our goal is to develop an adaptable resource allocation application
                        for computer labs. The app intelligently schedules computing courses, maximizing
                        the use of available resources while adhering to predefined constraints and restrictions.
                    </p>
                </section>

                <section>
                    <h2>Project Vision</h2>
                    <p>
                        The final product will adapt to new course entries and create the most efficient weekly layout 
                        of classes, ensuring optimal use of labs and resources within strict scheduling guidelines.
                    </p>
                </section>

                <section>
                    <h2>Meet the Team</h2>
                    <p>
                        We are a group of dedicated students working together to bring this solution to life. 
                        Meet our team <a href="https://github.com/mazfil/lab-allocator/blob/main/README.md#team-members-and-roles">here</a>.
                    </p>
                </section>

                <section>
                    <h2>Project Resources</h2>
                    <p>
                        We provide detailed documentation on our project, including technical constraints, stakeholder analysis, 
                        and development reports. Explore the full details on our <a href="https://github.com/mazfil/lab-allocator">GitHub repository</a>.
                    </p>
                </section>
            </div>
        );
    }
}
