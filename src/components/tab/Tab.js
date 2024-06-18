import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && children}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

const TabComponent = ({ tabs, selectedTabIndex = 0, onChange = () => { }, borderColor = '', indicatorColor = '', centered = false, className = '' }) => {
    const [value, setValue] = React.useState(selectedTabIndex);
    
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    React.useEffect(() => {
        if (selectedTabIndex != value) {
            setValue(selectedTabIndex)
        }
    }, [selectedTabIndex])

    return (
        <Box sx={{ width: "100%" }}>
            <Box sx={borderColor ? { borderBottom: 1, borderColor: borderColor } : { borderBottom: 1, borderColor: "rgba(255, 91, 29, 0.5)" }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    TabIndicatorProps={{
                        style: {
                            backgroundColor: indicatorColor ? indicatorColor : "#ff5b1d",
                            padding: 0
                        },
                    }}
                    centered={centered}
                >
                    {(tabs || []).map((tab, index) => {
                        if (tab.hidden) {
                            return null;
                        }
                        return (
                            <Tab
                                onClick={() => {
                                    if (tab.code) {
                                        onChange(index, tab.code, tab)
                                    } else {
                                        onChange(index, tab)
                                    }

                                    if (tab.onPress) {
                                        tab.onPress();
                                    }
                                }}
                                style={{fontSize: '0.8937rem'}}
                                key={index}
                                label={tab.title}
                                {...a11yProps(index)}
                            />
                        )
                    })}
                </Tabs>
            </Box>
            {tabs.map((tab, index) => (
                <TabPanel key={index} value={value} index={index}>
                    <div className={className}>
                        {tab.children}
                    </div>
                </TabPanel>
            ))}
        </Box>
    );
};

export default TabComponent;
