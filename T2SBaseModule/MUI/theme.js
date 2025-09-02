// Theme Configuration
export const theme = {
    // Typography
    typography: {
        h1: {
            fontSize: 48,
            lineHeight: 58
        },
        h2: {
            fontSize: 36,
            lineHeight: 44
        },
        h3: {
            fontSize: 30,
            lineHeight: 36
        },
        h4: {
            fontSize: 24,
            lineHeight: 30
        },
        h5: {
            fontSize: 20,
            lineHeight: 24
        },
        h6: {
            fontSize: 18,
            lineHeight: 22
        },
        subtitle1: {
            fontSize: 18,
            lineHeight: 24
        },
        subtitle2: {
            fontSize: 16,
            lineHeight: 22
        },
        body1: {
            fontSize: 14,
            lineHeight: 20
        },
        body2: {
            fontSize: 13,
            lineHeight: 18
        },
        caption: {
            fontSize: 12,
            lineHeight: 14
        },
        caption2: {
            fontSize: 10,
            lineHeight: 12
        },
        colors: {
            default: 'textMain',
            neutral: 'textGrey',
            primary: 'primaryColor',
            secondary: 'secondary_color',
            info: 'blue',
            success: 'successGreen',
            warning: 'orange',
            danger: 'red'
        }
    },

    // Container Width
    containerWidth: 1440,
    containerPadding: 48,

    // Spacing
    spacing: {
        auto: 'auto',
        none: 0,
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48
    },

    // Spacing
    borderRadius: {
        none: 0,
        xs: 4,
        sm: 8,
        md: 12,
        lg: 18,
        xl: 24
    },

    // Component Styles
    component: {
        heading: {},
        input: {
            borderWidth: 1.5,
            size: {
                xs: {
                    height: 40,
                    fontSize: 13,
                    padding: 8,
                    margin: 20
                },
                sm: {
                    height: 48,
                    fontSize: 14,
                    padding: 12,
                    margin: 24
                },
                md: {
                    height: 56,
                    fontSize: 14,
                    padding: 12,
                    margin: 24
                },
                lg: {
                    height: 64,
                    fontSize: 16,
                    padding: 12,
                    margin: 24
                }
            },
            radius: {
                none: 0,
                xs: 4,
                sm: 8,
                md: 12,
                lg: 18
            },
            shadow: {
                shadowColor: 'rgba(0, 0, 0, 0.05)',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 1,
                shadowRadius: 2
            }
        },
        button: {
            variant: {
                solid: {
                    alpha: 1,
                    hoverAlpha: 0.9,
                    borderWidth: 0
                },
                flat: {
                    alpha: 0.08,
                    hoverAlpha: 0.1,
                    borderWidth: 0
                },
                bordered: {
                    alpha: 0,
                    hoverAlpha: 0.1,
                    borderWidth: 1
                },
                link: {
                    alpha: 0,
                    hoverAlpha: 0.12,
                    borderWidth: 0
                }
            },
            colors: {
                default: {
                    borderColor: 'borderColor',
                    backgroundColor: 'darkGrey',
                    color: 'textMain'
                },
                primary: {
                    borderColor: 'primaryColor',
                    backgroundColor: 'primaryColor',
                    color: 'primaryColor'
                },
                secondary: 'secondary_color',
                info: {
                    borderColor: 'blue',
                    backgroundColor: 'blue',
                    color: 'blue'
                },
                success: 'successGreen',
                warning: 'orange',
                danger: 'red',
                white: 'white',
                defaultWhite: 'defaultWhite'
            },
            size: {
                button: {
                    sm: {
                        height: 28,
                        fontSize: 11,
                        padding: 12,
                        iconSize: 16
                    },
                    md: {
                        height: 40,
                        fontSize: 14,
                        padding: 24
                    },
                    lg: {
                        height: 48,
                        fontSize: 16,
                        padding: 30
                    }
                },
                icon: {
                    sm: {
                        height: 28,
                        width: 28,
                        fontSize: 11
                    },
                    md: {
                        height: 36,
                        width: 36,
                        fontSize: 12
                    },
                    lg: {
                        height: 48,
                        width: 48,
                        padding: 8
                    }
                }
            }
        },
        chip: {
            elevation: {
                shadowColor: 'rgba(16, 24, 40, 0.06)',
                shadowOffset: {
                    width: 0,
                    height: 4
                },
                shadowOpacity: 1,
                shadowRadius: 8
            }
        },
        socialButton: {
            button: {
                sm: {
                    borderWidth: 1,
                    height: 40,
                    borderRadius: 8
                },
                md: {
                    borderWidth: 2,
                    height: 48,
                    borderRadius: 12
                }
            },
            circle: {
                sm: {
                    borderWidth: 1,
                    height: 40,
                    width: 40,
                    borderRadius: 40
                },
                md: {
                    borderWidth: 2,
                    height: 52,
                    width: 52,
                    borderRadius: 48
                }
            }
        },
        card: {
            colors: {
                grey: 'grey',
                white: 'white',
                borderColor: 'borderColor'
            },
            closeElevation: {
                shadowColor: 'rgba(0, 0, 0, 0.5)',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 1,
                shadowRadius: 4,
                elevation: 2
            }
        },
        modal: {
            size: {
                sm: {
                    width: 445,
                    margin: 'xxl'
                },
                md: {
                    width: 600,
                    height: 767,
                    margin: 'lg'
                },
                fullScreen: {
                    width: '100%',
                    height: '100%',
                    margin: 'none'
                }
            }
        },
        searchBar: {
            borderColor: 'borderColor',
            color: 'textMain',
            elevation: {
                shadowColor: 'rgba(16, 24, 40, 0.1)',
                shadowOffset: {
                    width: 0,
                    height: 0
                },
                shadowOpacity: 1,
                shadowRadius: 8
            },
            size: {
                xs: {
                    height: 40,
                    fontSize: 13,
                    paddingRight: 8,
                    paddingLeft: 40,
                    borderRadius: 12
                },
                sm: {
                    height: 48,
                    fontSize: 14,
                    paddingRight: 12,
                    paddingLeft: 40,
                    borderRadius: 12
                },
                md: {
                    height: 56,
                    fontSize: 14,
                    paddingRight: 12,
                    paddingLeft: 40,
                    borderRadius: 12
                },
                lg: {
                    height: 64,
                    fontSize: 16,
                    paddingRight: 12,
                    paddingLeft: 40,
                    borderRadius: 12
                }
            }
        }
    },

    microComponents: {
        address: {
            addressTwoLine: {
                verticalSpacing: 'md',
                separatorColor: 'borderColor',
                icon: {
                    name: 'MAP',
                    size: 22,
                    spacing: 'sm',
                    color: 'black'
                }
            }
        },
        cuisine: {
            cuisineBox: {
                px: 'none',
                py: 'sm',
                mb: 'sm',
                borderRadius: 12,
                selectionBackground: 'grey',
                maxWidth: 100,
                image: {
                    height: 80
                },
                text: {
                    level: 4,
                    spacing: 'none',
                    size: 'body1',
                    color: 'textGrey',
                    fontWeight: 'SEMI_BOLD',
                    align: 'center',
                    ellipsizeMode: 'tail'
                }
            }
        },
        widget: {
            mb: 'sm',
            pb: 'sm'
        }
    },

    // Elevation Styles
    elevation: {
        none: {},
        xs: {
            shadow1: {
                shadowColor: 'rgba(16, 24, 40, 0.1)',
                shadowOffset: {
                    width: 0,
                    height: 1
                },
                shadowOpacity: 1,
                shadowRadius: 3
            },
            shadow2: {
                shadowColor: 'rgba(16, 24, 40, 0.06)',
                shadowOffset: {
                    width: 0,
                    height: 1
                },
                shadowOpacity: 1,
                shadowRadius: 2
            }
        },
        sm: {
            shadow1: {
                shadowOffset: {
                    width: 0,
                    height: 4
                },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 3
            },
            shadow2: {
                shadowOffset: {
                    width: 0,
                    height: 2
                },
                shadowOpacity: 0.06,
                shadowRadius: 4,
                elevation: 1.5
            }
        },
        md: {
            shadow1: {
                shadowColor: 'black',
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.5,
                shadowRadius: 16,
                elevation: 10
            },
            shadow2: {
                shadowColor: 'black',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.03,
                shadowRadius: 6,
                elevation: 10
            }
        }
    },

    // Layout Styles
    pages: {
        authPage: {
            backgroundColor: 'dark',
            backgroundImage: '',
            layout: 2
        },
        modal: {
            sm: {
                maxWidth: 420,
                borderRadius: 16
            },
            md: {
                maxWidth: 630,
                borderRadius: 16
            }
        }
    }
};
