set(diode909_tilde_EXTERN_OUTPUT_NAME "diode909~" CACHE STRING "External name" FORCE)
set(C74_LIBRARY_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/externals")
set(AUTHOR_DOMAIN "com.transistorlabs")
set(BUNDLE_IDENTIFIER "diode909")
set(GIT_VERSION_TAG "1.2.1")
include("${MAX_SDK_BASE}/script/max-pretarget.cmake")
set(roms_inc "${CMAKE_CURRENT_BINARY_DIR}/generated/roms.inc")
add_custom_command(OUTPUT "${roms_inc}"
  COMMAND ${CMAKE_COMMAND} -E make_directory "${CMAKE_CURRENT_BINARY_DIR}/generated"
  COMMAND ${CMAKE_COMMAND} "-DDIR=${ROM_DIR}" "-DOUT=${roms_inc}" -P "${CMAKE_CURRENT_SOURCE_DIR}/../../cmake/embed_roms.cmake"
  DEPENDS "${CMAKE_CURRENT_SOURCE_DIR}/../../cmake/embed_roms.cmake" VERBATIM)
add_library(${PROJECT_NAME} MODULE diode909.cpp "${roms_inc}")
target_include_directories(${PROJECT_NAME} PRIVATE ${C74_INCLUDES} "${CMAKE_CURRENT_BINARY_DIR}/generated")
target_link_libraries(${PROJECT_NAME} PUBLIC engine)
if(WIN32)
  target_compile_definitions(${PROJECT_NAME} PRIVATE NOMINMAX)
endif()
include("${MAX_SDK_BASE}/script/max-posttarget.cmake")
