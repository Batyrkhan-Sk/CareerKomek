export default function RecommendationsBody({ recs, styles }) {
  return (
    <>
      {/* Career Paths */}
      {recs.careerPaths && recs.careerPaths.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Recommended Career Paths</h2>
          <div className={styles.pathsGrid}>
            {recs.careerPaths.map((path, i) => (
              <div key={i} className={styles.pathCard}>
                <div className={styles.pathNumber}>{i + 1}</div>
                <h3 className={styles.pathTitle}>{path.title}</h3>
                <p className={styles.pathDesc}>{path.description}</p>
                <div className={styles.pathMeta}>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Salary</span>
                    <span className={styles.metaValue}>{path.salary}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Demand</span>
                    <span className={`${styles.demandBadge} ${styles[path.demandLevel]}`}>
                      {path.demandLevel}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Legacy Careers */}
      {recs.careers && recs.careers.length > 0 && !recs.careerPaths && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Suggested Careers</h2>
          <div className={styles.listGrid}>
            {recs.careers.map((career, i) => (
              <div key={i} className={styles.listItem}>{career}</div>
            ))}
          </div>
        </section>
      )}

      {/* Skill Gaps */}
      {recs.skillGaps && recs.skillGaps.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Skills to Develop</h2>
          <div className={styles.skillsGrid}>
            {recs.skillGaps.map((skill, i) => (
              <div key={i} className={styles.skillCard}>
                <div className={styles.skillHeader}>
                  <h3 className={styles.skillName}>{skill.skill}</h3>
                  <span className={`${styles.priorityTag} ${styles[skill.priority]}`}>
                    {skill.priority}
                  </span>
                </div>
                <p className={styles.skillReason}>{skill.reason}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Legacy Skills */}
      {recs.skills_to_learn && recs.skills_to_learn.length > 0 && !recs.skillGaps && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Skills to Learn</h2>
          <div className={styles.listGrid}>
            {recs.skills_to_learn.map((skill, i) => (
              <div key={i} className={styles.listItem}>{skill}</div>
            ))}
          </div>
        </section>
      )}

      {/* Learning Roadmap */}
      {recs.learningRoadmap && recs.learningRoadmap.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Learning Roadmap</h2>
          <div className={styles.roadmapTimeline}>
            {recs.learningRoadmap.map((phase, i) => (
              <div key={i} className={styles.phaseBlock}>
                <div className={styles.phaseMarker}></div>
                <div className={styles.phaseContent}>
                  <h3 className={styles.phaseTitle}>{phase.phase}</h3>

                  {phase.topics?.length > 0 && (
                    <div className={styles.topicsSection}>
                      <h4 className={styles.subsectionTitle}>Topics</h4>
                      <div className={styles.topicTags}>
                        {phase.topics.map((topic, j) => (
                          <span key={j} className={styles.topicTag}>{topic}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {phase.resources?.length > 0 && (
                    <div className={styles.resourcesSection}>
                      <h4 className={styles.subsectionTitle}>Resources</h4>
                      <div className={styles.resourcesList}>
                        {phase.resources.map((resource, j) => (
                          <div key={j} className={styles.resourceItem}>
                            <div className={styles.resourceHeader}>
                              <span className={styles.resourceName}>{resource.name}</span>
                              {resource.isFree && (
                                <span className={styles.freeTag}>FREE</span>
                              )}
                            </div>
                            {resource.url && !resource.url.includes("example.com") && (
                              <a
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.resourceLink}
                              >
                                Visit resource
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recommended Courses */}
      {recs.courses && recs.courses.length > 0 && !recs.learningRoadmap && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Recommended Courses</h2>
          <div className={styles.listGrid}>
            {recs.courses.map((course, i) => (
              <div key={i} className={styles.listItem}>{course}</div>
            ))}
          </div>
        </section>
      )}

      {/* Immediate Actions */}
      {recs.immediateActions && recs.immediateActions.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Start Today</h2>
          <div className={styles.actionsGrid}>
            {recs.immediateActions.map((action, i) => (
              <div key={i} className={styles.actionCard}>
                <div className={styles.actionNumber}>{i + 1}</div>
                <p className={styles.actionText}>{action}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
