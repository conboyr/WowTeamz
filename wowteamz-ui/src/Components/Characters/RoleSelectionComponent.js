import { Select, MenuItem } from '@mui/material';
import { useState } from 'react';
const roleImages = {
    Tank: "https://cdn.raiderio.net/assets/img/role_tank-6cee7610058306ba277e82c392987134.png",
    Healer: "https://cdn.raiderio.net/assets/img/role_healer-984e5e9867d6508a714a9c878d87441b.png",
    DPS: "https://cdn.raiderio.net/assets/img/role_dps-eb25989187d4d3ac866d609dc009f090.png",
};
function RoleSelectionComponent({ character, handleUpdateRole }) {
    const [selectedRole, setSelectedRole] = useState(character.role || '');

    const handleChange = async (event) => {
        const newRole = event.target.value;
        setSelectedRole(newRole);  // Update the local state

        try {
            // Call the function to update the role
            await handleUpdateRole(character.name, newRole, character.raidTeam_id);  // Ensure handleUpdateRole is passed and defined
        } catch (error) {
            console.error("Error updating role:", error);
        }
    };

    return (
        <Select
            value={selectedRole}
            onChange={handleChange}
            displayEmpty
            renderValue={(value) => (
                value ? (
                    <img
                        src={roleImages[value]}
                        alt={`${value} role icon`}  // Alt text for accessibility
                        style={{ width: '24px', height: '24px' }}  // Adjust size as needed
                    />
                ) : "Select Role"
            )}
        >
            <MenuItem value="" disabled>
                Select Role
            </MenuItem>  // Default "Select Role" option
            {Object.entries(roleImages).map(([role, image]) => (
                <MenuItem key={role} value={role}>
                    <img
                        src={image}
                        alt={`${role} icon`}  // Alt text for accessibility
                        style={{ width: '24px', height: '24px' }}  // Adjust size as needed
                    />
                </MenuItem>
            ))}
        </Select>
    );
}

export default RoleSelectionComponent;