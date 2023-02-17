---
title: 'Shell script template'
date: '2023-02-15'
lastmod: '2023-02-16'
tags: ['shell', 'script', 'bash']
draft: false
summary: 'A minimal, functional template for basic bash scripting with proven practices'
images: ['/static/images/hydro_power_projects_ii_guri_II_venezuela.jpg']
layout: PostLayout
---

This post is about proven practices in shell scripting with `bash`. Shell scripting is a powerful and one of the oldest tool for automating tasks, and `bash` is one of the most popular shells out there. The following practices can help you write more efficient, maintainable, and secure scripts. These are tips and tricks I gathered and assembled from various sources.

## Proven practices

- Use `#!/usr/bin/env bash` as shebang for better compatibility, it will search the default version of  `bash` in the current environment, we don't have to define the absolute path to `bash`
- Change to the script's directory, makes sourcing helpers and additional scripts easier `cd "$(dirname "$0")"`
- Use `if [[ ! (return 0 2> /dev/null); ]] then` to check if the script was sourced, see: [bash - How to detect if a script is being sourced - Stack Overflow](https://stackoverflow.com/questions/2683279/how-to-detect-if-a-script-is-being-sourced/28776166#28776166)
- Use `set -o errexit` to exit on most errors, so bash exits rather than continuing the script execution
- Use `set -o nounset` to disallow expansion of unset variables, this will make the script to fail when accessing an unset variable
  > Use `"${VARNAME-}` to access a variable that might have not been set
- Use `set -o pipefail`  to ensure that a pipeline command will fail even if one command in the pipeline fails
- Use `sudo -v` to elevate privileges if needed, see `check_priv()` and `elevate_priv()` functions in the template
- Use `if [[ "${TRACE-0}" == "1" ]]; then set -o xtrace fi` to enable debug mode, then start the script with `TRACE=1 ./template.sh`
- Redirect error messages to to stderr, either use `echo "Error" >&2` or the `error "Error"` function
- Support long and and short options, `--command` and `-c` with `[[ $cmd =~ ^-*c(ommand)?$ ]];`

## Helpers

Bash functions are a way to group a set of commands and statements together, which can be reused, they allow for code modularity, making it easier to maintain, update and test scripts.

A function is defined using the syntax `function_name () { commands; }`. Arguments can be passed to a function, and accessed within the function using the special variables `$1`, `$2`, and so on.

Some common uses for bash functions include defining helper functions for repetitive tasks, creating custom commands that combine existing commands, and modularizing complex scripts into smaller, more manageable functions.

``` bash
# Use command with the -v option to check for the existence of an executable
has() {
	command -v "$1" 1>/dev/null 2>&1
} 
```

Useful text formatting and the corresponding functions to display messages.

``` bash
BOLD="$(tput bold 2>/dev/null || printf '')"
GREY="$(tput setaf 0 2>/dev/null || printf '')"
UNDERLINE="$(tput smul 2>/dev/null || printf '')"
RED="$(tput setaf 1 2>/dev/null || printf '')"
GREEN="$(tput setaf 2 2>/dev/null || printf '')"
YELLOW="$(tput setaf 3 2>/dev/null || printf '')"
BLUE="$(tput setaf 4 2>/dev/null || printf '')"
MAGENTA="$(tput setaf 5 2>/dev/null || printf '')"
NO_COLOR="$(tput sgr0 2>/dev/null || printf '')"

info() {
  printf '%s\n' "${BOLD}${GREY}>${NO_COLOR} $*"
}

warn() {
  printf '%s\n' "${YELLOW}! $*${NO_COLOR}"
}

error() {
  printf '%s\n' "${RED}x $*${NO_COLOR}" >&2
}

completed() {
  printf '%s\n' "${GREEN}✓${NO_COLOR} $*"

```

Check for elevated permission and elevate with sudo:

``` bash
elevate_priv() {
  if ! has sudo; then
    error 'Could not find the command "sudo"'
    exit 1
    fi
    if ! sudo -v; then
      error "Superuser not granted, aborting installation"
      exit 1
    fi
}

check_priv() {
  if ! [ "$EUID" -ne 0 ]; then
    sudo=""
    warn "Running as root!"
  else
    warn "Escalated permissions are required to continue."
    elevate_priv
    sudo="sudo"
  fi
 }
```

## Template

``` bash
#!/usr/bin/env bash

if ! (return 0 2> /dev/null); then
    set -o errexit      # Immediately exit if any command has a non-zero exit status
    set -o nounset      # Causes the script to terminate when a variable is referenced that is not previously defined
    set -o pipefail     # instructs bash to use the return code of a failed command within a pipline as the return code of the whole pipeline
fi

# Enable debug mode, >TRACE=1 ./template.sh
if [[ "${TRACE-0}" == "1" ]]; then
    set -o xtrace
fi

BOLD="$(tput bold 2>/dev/null || printf '')"
GREY="$(tput setaf 0 2>/dev/null || printf '')"
UNDERLINE="$(tput smul 2>/dev/null || printf '')"
RED="$(tput setaf 1 2>/dev/null || printf '')"
GREEN="$(tput setaf 2 2>/dev/null || printf '')"
YELLOW="$(tput setaf 3 2>/dev/null || printf '')"
BLUE="$(tput setaf 4 2>/dev/null || printf '')"
MAGENTA="$(tput setaf 5 2>/dev/null || printf '')"
NO_COLOR="$(tput sgr0 2>/dev/null || printf '')"

info() {
  printf '%s\n' "${BOLD}${GREY}>${NO_COLOR} $*"
}

warn() {
  printf '%s\n' "${YELLOW}! $*${NO_COLOR}"
}

error() {
  printf '%s\n' "${RED}x $*${NO_COLOR}" >&2
}

completed() {
  printf '%s\n' "${GREEN}✓${NO_COLOR} $*"
}

has() {
  command -v "$1" 1>/dev/null 2>&1
}

elevate_priv() {
  if ! has sudo; then
    error 'Could not find the command "sudo"'
    exit 1
    fi
    if ! sudo -v; then
      error "Superuser not granted, aborting installation"
      exit 1
    fi
}

check_priv() {

  if ! [ "$EUID" -ne 0 ]; then
    sudo=""
    warn "Running as root!"
  else
    warn "Escalated permissions are required to continue."
    elevate_priv
    sudo="sudo"
  fi
}

usage() {
  echo -e "template.sh\\n\\tMinimal, functional bash script template\\n"
  echo "Usage:"
  echo "  -c, --command                           - command to execute"
  echo "  -h, --help                              - displays this help"
}

# Change the directory to the script's
cd "$(dirname "$0")"

main() {
  cmd="${1:-}"

  #Add default value to the first argument
  #cmd="${1:---command}"

  if [[ $cmd =~ ^-*h(elp)?$ ]]; then
    usage
  elif [[ $cmd =~ ^-*c(ommand)?$ ]]; then
    check_priv
    info "Command to execute"
    user="$(sudo whoami)"
    info "Running as $user"
  else
    usage
  fi
}

main "$@"
```
