using System.Collections;

namespace Domain
{
    public class Activity
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public string City { get; set; }
        public string Venue { get; set; }
        public bool IsCancelled { get; set; }

        // Relation to the AppUser entity
        public ICollection<ActivityAttendee> Attendees { get; set; } = new List<ActivityAttendee>(); // List is used to initialize the collection

        // Relation to the Comment entity
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    }
}