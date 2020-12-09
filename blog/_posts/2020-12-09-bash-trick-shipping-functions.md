---
title: "Bash trick: shipping functions"
---
This is a short trick I've used several times in the past to great effect: serializing a bash function and pushing it across ssh or something similar.
This ensures a set of commands is only executed after fully arriving, and has numerous benefits.

In a nutshell, this means doing the following:

```bash
function do_some_stuff() {
    :
}

cat <(declare -f do_some_stuff) <(echo "do_some_stuff") | ssh ssh.example.com bash
cat <(declare -f do_some_stuff) <(echo "do_some_stuff") | docker run --rm example_image bash
```

# The Good

## Syntax highlighting

Compare these three options that check if a file exists and runs a program if it does:

```bash
function do_some_stuff() {
    if [[ -f ~/.some_random_file ]]; then
        invoke some --command with --options
    else
        echo "report some errors"
    fi
}

cat <(declare -f do_some_stuff) <(echo "do_some_stuff") | ssh ssh.example.com bash
```

```bash
cat <<BASH | ssh ssh.example.com bash
function do_some_stuff() {
    if [[ -f ~/.some_random_file ]]; then
        invoke some --command with --options
    else
        echo "report some errors"
    fi
}
do_some_stuff
BASH
```

```bash
ssh ssh.example.com bash -c 'function do_some_stuff() { if [[ -f ~/.some_random_file ]]; then invoke some --command with --options; else echo "report some error"; fi }; do_some_stuff'
```

By declaring the function locally first, we can benefit from syntax highlighting in our editors, tracking the function in version control, and generally being able to test it locally first.

## Avoiding quote hell

Embedding multiple layers of quotes is a colossal pain in the ass.
It can get bad with backslashes, but it can get even worse in bash if you prefer single quotes because a quoted single quote is either `'"'"'` or `'\''`.
Fortunately, bash already includes ways to serialize out the raw representation of functions so using it can help us sidestep the need to escape embedded quotes.
This way we can put a stop to things before they start looking like this:

```bash
echo 'echo '"'"'echo '"'"'"'"'"'"'"'"'hello world'"'"'"'"'"'"'"'"' '"'"' | bash' | bash
echo 'echo '\''echo '\''\'\'''\''hello world'\''\'\'''\'' '\'' | bash' | bash
echo "echo \"echo \\\"hello world\\\"\" | bash" | bash
```

## Always using the latest version

Knight Capital Group lost over 400 million USD because they forgot to run git pull on one of their eight servers.
Would you like to rely on social conventions or playbooks or checklists, or would you prefer to know that whatever tool you're using will always use the latest version of your code?
The alternative to this approach would be to copy over files in separate sessions, fiddle with permission bits, invoke, and remember to clean up at the end.

## Auto-formatting

This prints out the function in a standard manner (I'm unsure if it's simply emitting some standard visitation order of the AST or what, but the specific mechanism probably isn't important):

```bash
function foo() { echo hi; if [[ -f bar ]]; then echo 'bar exists'; else echo 'bar does not exist'; fi }
```

Is emitted as:

```bash
foo ()
{
    echo hi;
    if [[ -f bar ]]; then
        echo 'bar exists';
    else
        echo 'bar does not exist';
    fi
}
```

While I personally prefer both `function` and `()` around my functions, it's hard to argue with something that comes built in and doesn't offer any configuration knobs.

## Atomicity

This ensures that your entire script runs, even if the connection gets killed partway through.
While not intentional, I tested this by sending SIGINT to my local ssh client which did not kill the script:

```bash
function sleep_and_wait() {
    for i in {0..100}; do
        echo $i >> sleep_and_wait.output
        sleep 1
    done
}
cat <(declare -f sleep_and_wait) <(echo "sleep_and_wait") | ssh ssh.example.com bash
```

Although some versions of systemd have been known to kill all session processes.

# The Bad

I'm really not able to find anything truly bad about this approach, and the more I test it out the more I become convinced it is the One True Way to run code remotely.
That having been said I'm open to explanations of why this isn't a good idea.

# The Ugly

The syntax is a little verbose and requires some boilerplate, but I don't think there's any way to make it appreciably smaller than this:

```bash
function ship_function() {
    declare -f "$1"
    printf "%s" "$1"
}

cat <(ship_function ship_function) | ssh ssh.example.com bash
```
