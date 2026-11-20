set_property(DIRECTORY PROPERTY max::external YES)
project(ticco909_tilde)
target_sources(ticco909_tilde PRIVATE ticco909.cpp)
target_link_libraries(ticco909_tilde PRIVATE engine)
