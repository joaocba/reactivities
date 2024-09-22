using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// This is an interface that is used to access the username of the current user in the application between the API and the Application layer throught the IUserAccessor interface

namespace Application.Interfaces
{
    public interface IUserAccessor
    {
        string GetUsername();
    }
}