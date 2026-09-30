# Doctor Profile Management

This document describes the doctor profile management functionality implemented in the HMS frontend React application.

## Features

### 1. Doctor Profile Display

- **Component**: `DoctorProfileInfo.jsx`
- **Location**: `src/components/doctors/DoctorProfileInfo.jsx`
- **Features**:
  - Display current doctor information
  - Shows personal details (name, date of birth, gender)
  - Shows contact information (email, phone, address)
  - Shows professional information (career title, department, designation, specialization, qualifications, experience)
  - Shows account status (approved/pending, active/inactive)
  - Edit button to switch to edit mode

### 2. Doctor Profile Editing

- **Component**: `DoctorProfileEdit.jsx`
- **Location**: `src/components/doctors/DoctorProfileEdit.jsx`
- **Features**:
  - Form-based editing of doctor information
  - Input validation for all fields
  - Dropdown selections for department and designation
  - Real-time form updates
  - Success/error messages
  - Cancel and save functionality

### 3. Combined Profile Management

- **Component**: `DoctorProfile.jsx`
- **Location**: `src/components/doctors/DoctorProfile.jsx`
- **Features**:
  - Manages state between view and edit modes
  - Seamless transition between display and edit components

## API Integration

### Service Layer

- **File**: `src/services/doctorProfileService.js`
- **Endpoints**:
  - `GET /doctors/profile` - Retrieve current doctor profile
  - `PUT /doctors/profile/update` - Update doctor profile

### API Configuration

- Uses `axiosInstanceDoctorService` for authenticated requests
- Base URL configured via `src/config/apiConfig.js`
- Automatic token injection for authentication

## Usage

### In Doctor Dashboard

The doctor profile functionality is accessible via:

```jsx
// Added to DoctorSidebar.jsx
<li className="flex items-center p-2 hover:bg-green-600 bg-green-500 cursor-pointer mb-2">
  <AccountCircleIcon className="text-white" />
  <Link
    to="/doctor/profile"
    className="ml-4 text-base font-semibold text-white"
  >
    My Profile
  </Link>
</li>
```

### Navigation

- Accessible via "My Profile" tab in the doctor sidebar
- URL: `/doctor/profile`
- Integrated with existing DoctorSidebar and navbar components

## Data Structure

### DoctorDto Fields

```javascript
{
  doctorId: String,
  userId: Number,
  email: String,
  firstName: String,
  lastName: String,
  dateOfBirth: String (ISO date),
  gender: String (MALE, FEMALE, OTHER),
  phoneNumber: String,
  address: String,
  careerTitle: String,
  department: String (CARDIOLOGY, NEUROLOGY, etc.),
  designation: String (JUNIOR_DOCTOR, SENIOR_DOCTOR, etc.),
  specialization: String,
  qualifications: String,
  experienceYears: Number,
  isApproved: Boolean,
  isActive: Boolean
}
```

## Styling

### Design System

- Tailwind CSS for styling
- Heroicons for consistent iconography
- Green gradient headers (differentiating from patient's blue theme)
- Responsive design (mobile-friendly)
- Form validation styles
- Loading and error states

### Key Design Elements

- Professional medical theme with green accent
- Clear visual hierarchy
- Intuitive form layouts with professional fields
- Accessible color contrasts
- Smooth transitions

## Error Handling

### Client-side Validation

- Required field validation
- Email format validation
- Number validation for experience years
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

## Professional Fields

### Department Options

- CARDIOLOGY
- NEUROLOGY
- ORTHOPEDICS
- PEDIATRICS
- DERMATOLOGY
- GENERAL_MEDICINE
- SURGERY
- GYNECOLOGY
- PSYCHIATRY
- EMERGENCY

### Designation Options

- JUNIOR_DOCTOR
- SENIOR_DOCTOR
- CONSULTANT
- HEAD_OF_DEPARTMENT
- CHIEF_MEDICAL_OFFICER

## Future Enhancements

### Potential Improvements

1. **Profile Picture Upload**: Add image upload functionality
2. **Certificate Management**: Upload and manage medical certificates
3. **Schedule Management**: Integrate working hours and availability
4. **Performance Metrics**: Show appointment statistics and ratings
5. **Continuing Education**: Track CME credits and certifications

### Advanced Features

1. **Multi-specialty Support**: Support for multiple specializations
2. **Team Management**: Manage assistant doctors and nurses
3. **Research Publications**: Track and display published papers
4. **Patient Feedback**: Display patient reviews and ratings

## File Structure

```
src/
├── components/
│   └── doctors/
│       ├── DoctorProfile.jsx           # Main container component
│       ├── DoctorProfileInfo.jsx       # Display component
│       └── DoctorProfileEdit.jsx       # Edit form component
├── services/
│   └── doctorProfileService.js         # API service layer
├── utils/
│   └── axiosInstanceDoctorService.js   # Axios instance configuration
├── pages/
│   └── doctor-profile/
│       └── DoctorProfilePage.jsx       # Main profile page
└── components/
    └── sidebar/
        └── DoctorSidebar.jsx           # Updated with profile link
```

## Testing

### Recommended Test Cases

1. **Profile Display**:

   - Load doctor profile data
   - Handle loading states
   - Display error messages
   - Show empty states
   - Professional information display

2. **Profile Editing**:

   - Form input validation
   - Dropdown selections
   - Successful profile updates
   - Error handling during save
   - Cancel functionality

3. **Integration**:
   - Sidebar navigation
   - Component state management
   - API service integration
   - Route protection

## Dependencies

### Required Packages

- `react` - Core React library
- `prop-types` - Runtime type checking
- `@heroicons/react` - Icon library
- `@mui/icons-material` - Material UI icons
- `axios` - HTTP client

### Development Dependencies

- `tailwindcss` - Utility-first CSS framework
- `eslint` - Code linting
- `vite` - Build tool

## Contributing

When modifying doctor profile functionality:

1. Maintain consistent API service patterns
2. Follow existing component structure
3. Update PropTypes for new props
4. Test both view and edit modes
5. Ensure responsive design
6. Handle loading and error states
7. Update professional field options as needed
8. Update this documentation
