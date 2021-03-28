export default function UserDetails({ user, heading, body }) {
    // "Pure component"
    return (
        <div>
            <div>
                Heading Info
                {heading}
            </div>
            <div>
                Body Info
                {body}
            </div>
        </div>
    );
}