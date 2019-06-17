<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="401.aspx.cs" Inherits="IP.ProRBA.Web._401" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <h1>401 - Unauthorize</h1>
        Sorry, you have no access to this page.
        <pre><%= Request.Url.Host + ":" + Request.Url.Port + Request["refUrl"] %></pre>
        <p>
            <a href="/login.aspx">Go to login page</a>
        </p>
    </div>
    </form>
</body>
</html>
