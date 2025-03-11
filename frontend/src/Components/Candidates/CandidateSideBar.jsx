import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { User, MapPin, Code, FileText, GraduationCap } from 'lucide-react';

// TabPanel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// Main component
export default function ProfileTabs() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Tab items
  const tabItems = [
    { label: 'Overview', icon: <User size={20} />, content: 'Overview Content' },
    { label: 'Personal', icon: <MapPin size={20} />, content: 'Personal Content' },
    { label: 'Skills', icon: <Code size={20} />, content: 'Skills Content' },
    { label: 'Education', icon: <GraduationCap size={20} />, content: 'Education Content' },
    { label: 'Other Info', icon: <FileText size={20} />, content: 'Other Info Content' },
  ];

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="scrollable" // Allow scrolling on smaller screens
        scrollButtons="auto" // Show scroll buttons when tabs overflow
        aria-label="profile navigation tabs"
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          '& .MuiTabs-flexContainer': {
            justifyContent: 'flex-start', // Align tabs to the left on all screens
            gap: '5px',
          },
          '& .MuiTab-root': {
            minWidth: 'auto', // Allow tabs to shrink based on content
            padding: '6px 8px',
            textTransform: 'none',
            fontSize: '14px', // Default font size
            fontWeight: 'medium',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            // Responsive styles for mobile
            '@media (max-width: 600px)': {
              fontSize: '12px', // Smaller font size for mobile
              padding: '4px 6px', // Smaller padding for mobile
              '& svg': {
                width: '16px', // Smaller icon size for mobile
                height: '16px',
              },
            },
          },
        }}
      >
        {tabItems.map((tab, index) => (
          <Tab
            key={index}
            label={
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {tab.icon}
                <span>{tab.label}</span>
              </div>
            }
            id={`profile-tab-${index}`}
            aria-controls={`profile-tabpanel-${index}`}
          />
        ))}
      </Tabs>

      {tabItems.map((tab, index) => (
        <TabPanel key={index} value={activeTab} index={index}>
          {tab.content}
        </TabPanel>
      ))}
    </Box>
  );
}