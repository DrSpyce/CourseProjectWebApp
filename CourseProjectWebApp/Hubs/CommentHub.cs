using Microsoft.AspNetCore.SignalR;
using System.Threading.Channels;
using System;
using System.Runtime.CompilerServices;
using Microsoft.AspNetCore.Authorization;
using System.Threading;
using CourseProjectWebApp.Models;
using CourseProjectWebApp.Services;

namespace CourseProjectWebApp.Hubs
{
    [Authorize]
    public class CommentHub : Hub
    {
        public async Task AddToGroup(string groupName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        }
    }
}
