cmake_minimum_required(VERSION 3.25)
# The DIODE 909 circuit engine (TR-909 voice board). The Max external lives in m4l/.
project(Diode909Engine LANGUAGES C CXX)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
find_package(Threads REQUIRED)
set(machine ${CMAKE_CURRENT_SOURCE_DIR}/machines/tr909)
file(GLOB netlists CONFIGURE_DEPENDS "${machine}/core/netlists/*.cir")
foreach(path IN LISTS netlists)
  get_filename_component(name "${path}" NAME_WE)
  list(APPEND names "${name}")
endforeach()
list(JOIN names "," names)
set(header "${CMAKE_CURRENT_BINARY_DIR}/generated/tr909/netlists.h")
add_custom_command(OUTPUT "${header}"
  COMMAND ${CMAKE_COMMAND} -E make_directory "${CMAKE_CURRENT_BINARY_DIR}/generated/tr909"
  COMMAND ${CMAKE_COMMAND} "-DDIR=${machine}/core/netlists" "-DOUT=${header}" "-DNAMES=${names}"
          -P "${machine}/tools/cmake/netlists.cmake"
  DEPENDS ${netlists} "${machine}/tools/cmake/netlists.cmake" VERBATIM)
add_library(engine STATIC Engine.cpp "${header}"
  ${machine}/core/circuit.cpp ${machine}/core/voiceboard.cpp ${machine}/core/oversampler.cpp
  ${machine}/core/noise.cpp ${machine}/core/cymbals.cpp ${machine}/core/hihat.cpp ${machine}/core/parallel.cpp)
set_target_properties(engine PROPERTIES POSITION_INDEPENDENT_CODE ON)
target_include_directories(engine PUBLIC . machines PRIVATE "${CMAKE_CURRENT_BINARY_DIR}/generated")
target_link_libraries(engine PUBLIC Threads::Threads)
if(CMAKE_CXX_COMPILER_ID MATCHES "Clang|GNU" AND NOT CMAKE_CXX_COMPILER_FRONTEND_VARIANT STREQUAL "MSVC")
  set_source_files_properties(${machine}/core/circuit.cpp PROPERTIES COMPILE_OPTIONS "-fno-builtin-memcpy;-fno-builtin-memmove")
endif()
add_executable(smoke Smoke.cpp)
target_link_libraries(smoke PRIVATE engine)
enable_testing()
add_test(NAME engine-smoke COMMAND smoke)
