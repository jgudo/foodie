import { Component } from 'react';

class Boundary extends Component {
    static getDerivedStateFromError(error: any) {
        return { hasError: true };
    }

    state = {
        hasError: false
    };


    componentDidCatch(error: any, errorInfo: any) {
        console.log(error);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="loader">
                    <h3>:( Something went wrong.</h3>
                </div>
            );
        }

        return this.props.children;
    }
}

export default Boundary;