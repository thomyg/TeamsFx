# TeamsFx .NET SDK

A NuGet package for Blazor projects which aims to reduce the developer tasks of implementing identity and access to cloud resources.

[TeamsFx SDK for JavaScript/TypeScript](https://github.com/OfficeDev/TeamsFx/tree/main/packages/sdk) |
[API reference documentation](https://aka.ms/teamsfx-sdk-help)

## Getting started

Build Teams apps with Blazor and the TeamsFx .NET SDK using Teams Toolkit. [Visit the documentation to learn more](https://docs.microsoft.com/en-us/microsoftteams/platform/toolkit/visual-studio-overview).

### Prerequisites

1. Install the `ASP.NET and web development` workload using the Visual Studio Installer.
2. Launch Visual Studio and create a new Blazor project.

## Usage

### How to get the package

1. Right-click on the project in Visual Studio and choose Manage NuGet Packages.
2. Search for `Microsoft.TeamsFx` and add it to the Blazor project.

Alternately, you can use the Package Manager.

```ps
> Install-Package Microsoft.TeamsFx
```

### How to choose version
For .NET 5 projects (VS 2019): Choose version < 0.3.0-rc.
For .NET 6 projects (VS 2022): Choose version >= 0.3.0-rc.

### Using Teams User Credential in Teams Tab app

1. Add authentication options in appsettings.{Environment}.json file.
```json
"TeamsFx": {
    "Authentication": {
        "ClientId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        "SimpleAuthEndpoint": "https://localhost:44357/",
        "InitiateLoginEndpoint": "https://localhost:44357/auth-start.html"
    }
}
```
2. Add `TeamsFx` to services during startup.
```csharp
public void ConfigureServices(IServiceCollection services)
{
    ...
    services.AddTeamsFx(Configuration);
}
```
3. Add the required namespaces to the `_Imports.razor` file.
```csharp
@using Microsoft.TeamsFx
```
4. Inject the registered TeamsFx services for any page that needs them.
```csharp
@inject TeamsFx teamsfx
@inject TeamsUserCredential teamsUserCredential
```
5. Call `teamsUserCredential.GetTokenAsync()` to get token or pass `teamsUserCredential` to other functions.
```csharp
try
{
    await teamsUserCredential.GetTokenAsync(
        new TokenRequestContext(new string[] { "User.Read" }),
        new System.Threading.CancellationToken());
}
catch (ExceptionWithCode e)
{
    if (e.Code == ExceptionCode.UiRequiredError)
    {
        // show login button to let user consent
    }
    else
    {
        throw;
    }
}
```

#### Upgrade from 0.1.0-rc to 0.3.0-rc
If there is an existing project created in VS2019, you can use the following steps to upgrade:
1. Open project in VS2022 and change project target framework to ".NET 6".

2. Upgrade dependencies:
  `Microsoft.TeamsFx.SimpleAuth` to `0.1.2`,
  `Newtonsoft.Json` to `13.0.1`,
  `Microsoft.Graph` to `4.12.0`,
  `Microsoft.Fast.Components.FluentUI` to `1.1.0`.

3. Add following lines in appsettings.{Environment}.json file after "ALLOWED_APP_IDS".
```json
"ALLOWED_APP_IDS": "...",
"TeamsFx": {
    "Authentication": {
        "ClientId": "value copied from CLIENT_ID",
        "SimpleAuthEndpoint": "value copied from TAB_APP_ENDPOINT",
        "InitiateLoginEndpoint": "{value copied from TAB_APP_ENDPOINT}/auth-start.html"
    }
}
```

4. Add following lines in `Startup.cs`.
```csharp
public void ConfigureServices(IServiceCollection services)
{
    ...
    services.AddTeamsFx(Configuration.GetSection("TeamsFx"));
}
```
and remove following 2 lines.
```csharp
services.AddScoped<TeamsFx>();
services.AddScoped<TeamsUserCredential>();
```

5. Remove following codes in `Welcome.razor`.
```csharp
var clientId = Configuration.GetValue<string>("CLIENT_ID");
var endpoint = MyNavigationManager.BaseUri;

await teamsfx.SetLogLevelAsync(LogLevel.Verbose);
await teamsfx.SetLogFunctionAsync(printLog);

AuthenticationConfiguration authentication = new AuthenticationConfiguration(clientId: clientId, simpleAuthEndpoint: endpoint, initiateLoginEndpoint: endpoint + "auth-start.html");
Configuration configuration = new Configuration(authentication);
await teamsfx.LoadConfigurationAsync(configuration);
...
private void printLog(LogLevel level, string message)
{
    Console.WriteLine(message);
}
```

### Configure Logging
`ILogger` is used to print logs. You can configure logging in appsettings.{Environment}.json. [Visit the ASP.NET documentation to learn more](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/logging/?view=aspnetcore-5.0#configure-logging-1) 

### Bot
Will be supported in the future.

## Data Collection.

The software may collect information about you and your use of the software and send it to Microsoft. Microsoft may use this information to provide services and improve our products and services. You may turn off the telemetry as described in the repository. There are also some features in the software that may enable you and Microsoft to collect data from users of your applications. If you use these features, you must comply with applicable law, including providing appropriate notices to users of your applications together with a copy of Microsoft's privacy statement. Our privacy statement is located at https://go.microsoft.com/fwlink/?LinkID=824704. You can learn more about data collection and use in the help documentation and our privacy statement. Your use of the software operates as your consent to these practices.

## Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Contributing

There are many ways in which you can participate in the project, for example:

- [Submit bugs and feature requests](https://github.com/OfficeDev/TeamsFx/issues), and help us verify as they are checked in
- Review [source code changes](https://github.com/OfficeDev/TeamsFx/pulls)

If you are interested in fixing issues and contributing directly to the code base, please see the [Contributing Guide](./CONTRIBUTING.md).

## Reporting Security Issues

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them to the Microsoft Security Response Center (MSRC) at [https://msrc.microsoft.com/create-report](https://msrc.microsoft.com/create-report).

If you prefer to submit without logging in, send email to [secure@microsoft.com](mailto:secure@microsoft.com). If possible, encrypt your message with our PGP key; please download it from the the [Microsoft Security Response Center PGP Key page](https://www.microsoft.com/en-us/msrc/pgp-key-msrc).

You should receive a response within 24 hours. If for some reason you do not, please follow up via email to ensure we received your original message. Additional information can be found at [microsoft.com/msrc](https://www.microsoft.com/msrc).

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft trademarks or logos is subject to and must follow [Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general). Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship. Any use of third-party trademarks or logos are subject to those third-party's policies.

## License

Copyright (c) Microsoft Corporation. All rights reserved.

Licensed under the [MIT](LICENSE.txt) license.
