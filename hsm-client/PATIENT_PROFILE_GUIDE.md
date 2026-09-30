# Patient Profile Management

This document describes the patient profile management functionality implemented in the HMS frontend React application.

## Features

### 1. Patient Profile Display

- **Component**: `PatientProfileInfo.jsx`
- **Location**: `src/components/patients/PatientProfileInfo.jsx`
- **Features**:
  - Display current patient information
  - Shows personal details (name, date of birth, gender, blood group)
  - Shows contact information (email, phone, address)
  - Shows account status (approved/pending, active/inactive)
  - Edit button to switch to edit mode

### 2. Patient Profile Editing

- **Component**: `PatientProfileEdit.jsx`
- **Location**: `src/components/patients/PatientProfileEdit.jsx`
- **Features**:
  - Form-based editing of patient information
  - Input validation
  - Real-time form updates
  - Success/error messages
  - Cancel and save functionality

### 3. Combined Profile Management

- **Component**: `PatientProfile.jsx`
- **Location**: `src/components/patients/PatientProfile.jsx`
- **Features**:
  - Manages state between view and edit modes
  - Seamless transition between display and edit components

## API Integration

### Service Layer

- **File**: `src/services/patientProfileService.js`
- **Endpoints**:
  - `GET /patients/profile` - Retrieve current patient profile
  - `PUT /patients/profile/update` - Update patient profile

### API Configuration

- Uses `axiosInstancePatientService` for authenticated requests
- Base URL configured via `src/config/apiConfig.js`
- Automatic token injection for authentication

## Usage

### In Patient Dashboard

The patient profile functionality is integrated into the main patient dashboard:

```jsx
// Added to PatientAppointmentDashboard.jsx
import PatientProfile from "../../components/patients/PatientProfile";

const menuItems = [
  {
    id: "profile",
    label: "My Profile",
    icon: UserCircleIcon,
    component: PatientProfile,
  },
  // ... other menu items
];
```

### Navigation

- Accessible via "My Profile" tab in the patient dashboard
- Default view when patient dashboard loads
- Integrated with existing sidebar and navbar components

## Data Structure

### PatientDto Fields

```javascript
{
  patientId: String,
  userId: Number,
  email: String,
  firstName: String,
  lastName: String,
  dateOfBirth: String (ISO date),
  gender: String (MALE, FEMALE, OTHER),
  bloodGroup: String (A_POSITIVE, A_NEGATIVE, etc.),
  phoneNumber: String,
  address: String,
  isApproved: Boolean,
  isActive: Boolean
}
```

## Styling

### Design System

- Tailwind CSS for styling
- Heroicons for consistent iconography
- Gradient headers with blue theme
- Responsive design (mobile-friendly)
- Form validation styles
- Loading and error states

### Key Design Elements

- Professional medical theme
- Clear visual hierarchy
- Intuitive form layouts
- Accessible color contrasts
- Smooth transitions

## Error Handling

### Client-side Validation

- Required field validation
- Email format validation
- Form submission prevention during save

### API Error Handling

- Network error display
- Retry functionality
- User-friendly error messages
- Loading states during API calls

## Security

### Authentication

- JWT token-based authentication
- Automatic token injection via Axios interceptors
- Protected API endpoints

### Data Validation

- Client-side input validation
- Server-side validation (handled by backend)
- PropTypes validation for React components

## Future Enhancements

### Potential Improvements

1. **Profile Picture Upload**: Add image upload functionality
2. **Field-level Validation**: Real-time validation for individual fields
3. **Audit Trail**: Track profile changes history
4. **Multi-language Support**: Internationalization for form labels
5. **Advanced Permissions**: Role-based field editing restrictions

### Performance Optimizations

1. **Caching**: Implement profile data caching
2. **Lazy Loading**: Code splitting for profile components
3. **Optimistic Updates**: Update UI before API confirmation

## Testing

### Recommended Test Cases

1. **Profile Display**:

   - Load patient profile data
   - Handle loading states
   - Display error messages
   - Show empty states

2. **Profile Editing**:

   - Form input validation
   - Successful profile updates
   - Error handling during save
   - Cancel functionality

3. **Integration**:
   - Dashboard navigation
   - Component state management
   - API service integration

## Dependencies

### Required Packages

- `react` - Core React library
- `prop-types` - Runtime type checking
- `@heroicons/react` - Icon library
- `axios` - HTTP client

### Development Dependencies

- `tailwindcss` - Utility-first CSS framework
- `eslint` - Code linting
- `vite` - Build tool

## File Structure

```
src/
├── components/
│   └── patients/
│       ├── PatientProfile.jsx          # Main container component
│       ├── PatientProfileInfo.jsx      # Display component
│       └── PatientProfileEdit.jsx      # Edit form component
├── services/
│   └── patientProfileService.js        # API service layer
├── utils/
│   └── axiosInstancePatientService.js  # Axios instance configuration
└── pages/
    └── patient-dashboard/
        └── PatientAppointmentDashboard.jsx  # Main dashboard
```

## Contributing

When modifying patient profile functionality:

1. Maintain consistent API service patterns
2. Follow existing component structure
3. Update PropTypes for new props
4. Test both view and edit modes
5. Ensure responsive design
6. Handle loading and error states
7. Update this documentation
