$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
npx tsx "$scriptDir\src\index.ts" start $args
