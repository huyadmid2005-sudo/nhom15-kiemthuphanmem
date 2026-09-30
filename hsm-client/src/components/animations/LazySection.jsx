import { memo } from "react";
import PropTypes from "prop-types";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";

/**
 * LazySection component with performance optimizations
 * Provides lazy loading and smooth animations for sections
 */
const LazySection = memo(
  ({
    children,
    className = "",
    animationType = "fadeInUp",
    threshold = 0.1,
    rootMargin = "0px 0px -50px 0px",
    delay = 0,
    duration = 0.8,
    id,
    as: Component = "section",
    showPlaceholder = false,
    placeholderHeight = "200px",
  }) => {
    const { targetRef, isIntersecting } = useIntersectionObserver({
      threshold,
      rootMargin,
      triggerOnce: true,
      freezeOnceVisible: true,
    });

    // Generate animation classes
    const animationClasses = isIntersecting
      ? `lazy-section--visible lazy-section--${animationType}`
      : "lazy-section--hidden";

    // Custom CSS properties for dynamic styling
    const style = {
      "--animation-delay": `${delay}s`,
      "--animation-duration": `${duration}s`,
    };

    return (
      <Component
        id={id}
        ref={targetRef}
        className={`lazy-section ${animationClasses} ${className}`}
        style={style}
      >
        {isIntersecting || !showPlaceholder ? (
          children
        ) : (
          <div
            className="lazy-section__placeholder"
            style={{ minHeight: placeholderHeight }}
          />
        )}
      </Component>
    );
  }
);

LazySection.displayName = "LazySection";

LazySection.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  animationType: PropTypes.oneOf([
    "fadeInUp",
    "fadeInDown",
    "fadeInLeft",
    "fadeInRight",
    "scaleIn",
    "slideInUp",
    "slideInDown",
    "rotateIn",
  ]),
  threshold: PropTypes.number,
  rootMargin: PropTypes.string,
  delay: PropTypes.number,
  duration: PropTypes.number,
  id: PropTypes.string,
  as: PropTypes.elementType,
  showPlaceholder: PropTypes.bool,
  placeholderHeight: PropTypes.string,
};

export default LazySection;
