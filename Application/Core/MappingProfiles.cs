using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            // Mapping properties from Activity domain class to Activity
            CreateMap<Activity, Activity>();
        }
    }
}